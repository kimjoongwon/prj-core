import {
	navigateToOidcLoginForm,
	submitOidcCredentials,
	waitForOidcConsentForm,
	type E2EPageLike,
} from "./oidc-login";

interface ApiResponseLike {
	status(): number;
	json(): Promise<unknown>;
}

interface ApiRequestLike {
	get(url: string): Promise<ApiResponseLike>;
	post(
		url: string,
		options?: {
			data?: unknown;
			headers?: Record<string, string>;
		},
	): Promise<ApiResponseLike>;
}

interface ConsoleLoginPageLike extends E2EPageLike {
	evaluate<Arg>(
		pageFunction: (arg: Arg) => void,
		arg: Arg,
	): Promise<void>;
	request: ApiRequestLike;
	url(): string;
}

interface InteractionData {
	type: "login" | "consent";
	uid: string;
}

interface RedirectResponse {
	redirectTo: string;
}

const DEFAULT_CONSOLE_BASE_URL =
	process.env.E2E_IDP_BASE_URL ?? "http://localhost:3008";
const DEFAULT_API_BASE_URL =
	process.env.E2E_IDP_API_BASE_URL ?? DEFAULT_CONSOLE_BASE_URL;
const LOGIN_PATH =
	process.env.E2E_IDP_LOGIN_PATH ?? "/api/v1/auth/login?clientId=idp-web";
const DASHBOARD_PATH = process.env.E2E_IDP_DASHBOARD_PATH ?? "/dashboard";
const INTERACTION_PATH =
	process.env.E2E_IDP_INTERACTION_PATH ?? "/api/interaction";
const AUTH_LOGIN_PATH = process.env.E2E_IDP_AUTH_LOGIN_PATH ?? "/auth/login";

function trimTrailingSlash(value: string) {
	return value.endsWith("/") ? value.slice(0, -1) : value;
}

function ensureLeadingSlash(path: string) {
	return path.startsWith("/") ? path : `/${path}`;
}

function buildPathWithQuery(
	path: string,
	query: Record<string, string>,
) {
	const [rawPath, rawSearch = ""] = path.split("?");
	const params = new URLSearchParams(rawSearch);
	for (const [key, value] of Object.entries(query)) {
		params.set(key, value);
	}
	const normalizedPath = ensureLeadingSlash(rawPath);
	const search = params.toString();
	return search ? `${normalizedPath}?${search}` : normalizedPath;
}

const consoleBaseUrl = trimTrailingSlash(DEFAULT_CONSOLE_BASE_URL);
const apiBaseUrl = trimTrailingSlash(DEFAULT_API_BASE_URL);
const normalizedDashboardPath = ensureLeadingSlash(DASHBOARD_PATH);
const loginEntryPath = buildPathWithQuery(LOGIN_PATH, {
	returnTo: `${consoleBaseUrl}${normalizedDashboardPath}`,
});
const normalizedInteractionPath = ensureLeadingSlash(INTERACTION_PATH);
const dashboardUrl = `${consoleBaseUrl}${normalizedDashboardPath}`;
const authLoginPath = ensureLeadingSlash(AUTH_LOGIN_PATH);

function buildApiUrl(path: string) {
	return `${apiBaseUrl}${ensureLeadingSlash(path)}`;
}
const DEFAULT_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@onora.com";
const DEFAULT_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "rkdmf12!@";
const CONSOLE_PERSIST_KEY = "idp-persist";
const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";
const SYSTEM_GROUND_NAME = "플랫폼 운영본부";

function extractInteractionUid(url: string): string | null {
	try {
		const parsed = new URL(url);
		const match = parsed.pathname.match(/^\/interaction\/([^/]+)$/);
		return match?.[1] ?? null;
	} catch {
		return null;
	}
}

function isDashboardUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		const target = new URL(dashboardUrl);
		return (
			parsed.origin === target.origin &&
			parsed.pathname.startsWith(target.pathname)
		);
	} catch {
		return false;
	}
}

async function fetchInteraction(
	page: ConsoleLoginPageLike,
	uid: string,
): Promise<InteractionData> {
	const response = await page.request.get(
		buildApiUrl(`${normalizedInteractionPath}/${uid}`),
	);

	if (response.status() !== 200) {
		throw new Error(`Failed to load interaction ${uid}: ${response.status()}`);
	}

	return (await response.json()) as InteractionData;
}

async function postInteractionRedirect(
	page: ConsoleLoginPageLike,
	uid: string,
	path: "login" | "confirm",
	body?: unknown,
): Promise<string> {
	const response = await page.request.post(
		buildApiUrl(`${normalizedInteractionPath}/${uid}/${path}`),
		body ? { data: body } : undefined,
	);

	if (response.status() !== 200) {
		throw new Error(
			`Interaction ${path} failed for ${uid}: ${response.status()}`,
		);
	}

	const payload = (await response.json()) as RedirectResponse;

	if (!payload.redirectTo) {
		throw new Error(`Interaction ${path} did not return redirectTo for ${uid}`);
	}

	return payload.redirectTo;
}

async function seedConsolePersist(page: ConsoleLoginPageLike) {
	const response = await page.request.post(buildApiUrl("/api/v1/auth/current-space"), {
		data: { spaceId: SYSTEM_SPACE_ID },
	});

	if (response.status() !== 200) {
		throw new Error(`Failed to select console space: ${response.status()}`);
	}

	const payload = (await response.json()) as {
		data?: {
			id?: string;
			ground?: {
				name?: string;
			};
		};
	};

	if (payload.data?.id !== SYSTEM_SPACE_ID) {
		throw new Error("Selected console space did not match the system space.");
	}

	const groundName = payload.data.ground?.name ?? SYSTEM_GROUND_NAME;
	const now = Date.now();

	await page.evaluate(
		({ storageKey, spaceId, selectedGroundName, accessTokenExpiresAt, refreshTokenExpiresAt }) => {
			window.localStorage.setItem(
				storageKey,
				JSON.stringify({
					spaceId,
					groundName: selectedGroundName,
					spaces: [{ spaceId, groundName: selectedGroundName }],
					accessTokenExpiresAt,
					refreshTokenExpiresAt,
				}),
			);
		},
		{
			storageKey: CONSOLE_PERSIST_KEY,
			spaceId: SYSTEM_SPACE_ID,
			selectedGroundName: groundName,
			accessTokenExpiresAt: now + 60 * 60 * 1000,
			refreshTokenExpiresAt: now + 30 * 24 * 60 * 60 * 1000,
		},
	);
}

export async function loginToConsole(page: ConsoleLoginPageLike) {
	for (let attempt = 1; attempt <= 3; attempt++) {
		try {
			await page.goto(loginEntryPath, { waitUntil: "domcontentloaded" });

			for (let step = 0; step < 5; step++) {
				const currentUrl = page.url();
				if (isDashboardUrl(currentUrl)) {
					await seedConsolePersist(page);
					await page.goto(normalizedDashboardPath, {
						waitUntil: "domcontentloaded",
					});
					return;
				}

				const uid = extractInteractionUid(currentUrl);
				if (!uid) {
					await page.waitForTimeout(500);
					continue;
				}

				const interaction = await fetchInteraction(page, uid);

				if (interaction.type === "login") {
					const redirectTo = await postInteractionRedirect(page, uid, "login", {
						email: DEFAULT_EMAIL,
						password: DEFAULT_PASSWORD,
						remember: false,
					});
					await page.goto(redirectTo, { waitUntil: "domcontentloaded" });
					continue;
				}

				const redirectTo = await postInteractionRedirect(page, uid, "confirm");
				await page.goto(redirectTo, { waitUntil: "domcontentloaded" });
			}

			throw new Error("OIDC console login did not reach dashboard in time.");
		} catch (error) {
			if (attempt === 3) {
				throw error;
			}
			await page.waitForTimeout(1000);
		}
	}

	throw new Error("OIDC console login failed after retries.");
}

export async function navigateToLoginForm(page: E2EPageLike) {
	const entry = await navigateToOidcLoginForm(page, {
		startPath: authLoginPath,
	});
	if (entry !== "login") {
		throw new Error("Expected OIDC login form but consent screen was shown.");
	}
}

export async function navigateToConsentForm(page: E2EPageLike) {
	const entry = await navigateToOidcLoginForm(page, {
		startPath: authLoginPath,
	});
	if (entry === "login") {
		await submitOidcCredentials(page);
	}
	await waitForOidcConsentForm(page);
}
