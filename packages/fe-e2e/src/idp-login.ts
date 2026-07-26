import {
	type AdminNativeAuthSession,
	mergeAdminPersistAccountSelection,
	mergeAdminPersistAuthSession,
	readAdminPersistAccessToken,
} from "./admin-persist";
import {
	type E2EPageLike,
	navigateToOidcLoginForm,
	submitOidcCredentials,
	waitForOidcConsentForm,
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
	evaluate<Result, Arg>(
		pageFunction: (arg: Arg) => Result,
		arg: Arg,
	): Promise<Result>;
	request: ApiRequestLike;
	url(): string;
}

const DEFAULT_CONSOLE_BASE_URL =
	process.env.E2E_ADMIN_BASE_URL ?? "http://localhost:3000/admin";
const DEFAULT_API_BASE_URL =
	process.env.E2E_CORE_API_BASE_URL ?? new URL(DEFAULT_CONSOLE_BASE_URL).origin;
const LOGIN_PATH =
	process.env.E2E_IDP_LOGIN_PATH ??
	"/api/v1/auth/oidc/login?clientId=admin-web";
const DASHBOARD_PATH = process.env.E2E_IDP_DASHBOARD_PATH ?? "/settings/auth";
const AUTH_LOGIN_PATH = process.env.E2E_ADMIN_AUTH_LOGIN_PATH ?? "/auth/login";

function trimTrailingSlash(value: string) {
	return value.endsWith("/") ? value.slice(0, -1) : value;
}

function ensureLeadingSlash(path: string) {
	return path.startsWith("/") ? path : `/${path}`;
}

function buildPathWithQuery(path: string, query: Record<string, string>) {
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
const consoleOrigin = new URL(consoleBaseUrl).origin;
const apiBaseUrl = trimTrailingSlash(DEFAULT_API_BASE_URL);
const normalizedDashboardPath = ensureLeadingSlash(DASHBOARD_PATH);
const dashboardUrl = `${consoleBaseUrl}${normalizedDashboardPath}`;
const nativeLoginUrl = `${consoleBaseUrl}${buildPathWithQuery(AUTH_LOGIN_PATH, {
	returnTo: dashboardUrl,
})}`;
const oidcLoginUrl = new URL(
	buildPathWithQuery(LOGIN_PATH, {
		returnTo: dashboardUrl,
	}),
	consoleOrigin,
).toString();

function buildApiUrl(path: string) {
	return `${apiBaseUrl}${ensureLeadingSlash(path)}`;
}
const nativeLoginApiUrl = buildApiUrl("/api/v1/auth/login");
const CONSENT_TIMEOUT_MS = 30000;
const DEFAULT_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@plate.com";
const DEFAULT_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "rkdmf12!@";
const CONSOLE_PERSIST_KEY = "admin-persist";
const SYSTEM_TENANT_ID =
	process.env.E2E_SYSTEM_TENANT_ID ?? "71ddca20-1752-466e-b4da-879ebdbe54e3";
const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";
const SYSTEM_FITNESS_CENTER_NAME = "플랫폼 운영본부";

async function seedConsolePersist(page: ConsoleLoginPageLike) {
	const accessToken = await readConsoleAccessToken(page);
	const response = await page.request.post(
		buildApiUrl("/api/v1/auth/current-space"),
		{
			data: { tenantId: SYSTEM_TENANT_ID },
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);

	if (response.status() !== 200) {
		throw new Error(`Failed to select console space: ${response.status()}`);
	}

	const payload = (await response.json()) as {
		data?: {
			id?: string;
			tenantId?: string | null;
			contentLanguageCode?: string | null;
			fitnessCenter?: {
				name?: string;
			};
		};
	};

	if (payload.data?.id !== SYSTEM_SPACE_ID) {
		throw new Error("Selected console space did not match the system space.");
	}
	if (payload.data?.tenantId !== SYSTEM_TENANT_ID) {
		throw new Error("Selected console tenant did not match the system tenant.");
	}

	const fitnessCenterName =
		payload.data.fitnessCenter?.name ?? SYSTEM_FITNESS_CENTER_NAME;
	const raw = await readConsolePersist(page);
	const document = mergeAdminPersistAccountSelection(raw, {
		tenantId: SYSTEM_TENANT_ID,
		spaceId: SYSTEM_SPACE_ID,
		fitnessCenterName,
		contentLanguageCode: payload.data.contentLanguageCode ?? null,
	});

	await page.evaluate(
		({ storageKey, value }) => {
			window.localStorage.setItem(storageKey, value);
		},
		{
			storageKey: CONSOLE_PERSIST_KEY,
			value: JSON.stringify(document),
		},
	);
}

/**
 * Admin console에 native 로그인하고 System FitnessCenter context를 저장합니다.
 *
 * @param page Admin console을 제어할 E2E page
 */
export async function loginToConsole(page: ConsoleLoginPageLike) {
	for (let attempt = 1; attempt <= 3; attempt++) {
		try {
			await page.goto(nativeLoginUrl, { waitUntil: "domcontentloaded" });
			const session = await requestNativeLogin(page);
			await writeConsoleNativeSession(page, session);
			await seedConsolePersist(page);
			await page.goto(dashboardUrl, {
				waitUntil: "domcontentloaded",
			});
			return;
		} catch (error) {
			if (attempt === 3) {
				throw error;
			}
			await page.waitForTimeout(1000);
		}
	}

	throw new Error("Native console login failed after retries.");
}

/**
 * OIDC 로그인 form으로 이동합니다.
 *
 * @param page OIDC 화면을 제어할 E2E page
 */
export async function navigateToLoginForm(page: E2EPageLike) {
	const entry = await navigateToOidcLoginForm(page, {
		startPath: oidcLoginUrl,
	});
	if (entry !== "login") {
		throw new Error("Expected OIDC login form but consent screen was shown.");
	}
}

export type OidcConsentNavigation = "consent" | "redirected";

/**
 * OIDC consent 화면으로 이동하거나 first-party redirect 완료를 기다립니다.
 *
 * @param page OIDC 화면을 제어할 E2E page
 * @returns consent 화면 또는 redirect 완료 상태
 */
export async function navigateToConsentForm(
	page: E2EPageLike,
): Promise<OidcConsentNavigation> {
	const entry = await navigateToOidcLoginForm(page, {
		startPath: oidcLoginUrl,
	});
	if (entry === "login") {
		await submitOidcCredentials(page);
		return waitForConsentOrFirstPartyRedirect(page);
	}

	await waitForOidcConsentForm(page);
	return "consent";
}

async function waitForConsentOrFirstPartyRedirect(
	page: E2EPageLike,
): Promise<OidcConsentNavigation> {
	const deadline = Date.now() + CONSENT_TIMEOUT_MS;
	while (Date.now() < deadline) {
		const remaining = Math.max(500, deadline - Date.now());
		const chunkTimeout = Math.min(remaining, 1000);
		const [consentResult, redirectResult] = await Promise.allSettled([
			waitForOidcConsentForm(page, { timeoutMs: chunkTimeout }),
			page.waitForURL((url) => url.pathname.endsWith(normalizedDashboardPath), {
				timeout: chunkTimeout,
			}),
		]);

		if (consentResult.status === "fulfilled") {
			return "consent";
		}

		if (redirectResult.status === "fulfilled") {
			return "redirected";
		}
	}

	throw new Error(
		"OIDC consent or first-party redirect did not complete in time.",
	);
}

async function requestNativeLogin(
	page: ConsoleLoginPageLike,
): Promise<AdminNativeAuthSession> {
	const response = await page.request.post(nativeLoginApiUrl, {
		data: {
			email: DEFAULT_EMAIL,
			password: DEFAULT_PASSWORD,
		},
	});

	if (response.status() !== 200) {
		throw new Error(`Native login failed: ${response.status()}`);
	}

	const payload = (await response.json()) as {
		data?: Partial<AdminNativeAuthSession>;
	};
	const session = payload.data;
	if (
		typeof session?.accessToken !== "string" ||
		typeof session.refreshToken !== "string" ||
		typeof session.sessionId !== "string" ||
		typeof session.accessTokenExpiresAt !== "number" ||
		typeof session.refreshTokenExpiresAt !== "number"
	) {
		throw new Error("Native login response is invalid.");
	}

	return {
		accessToken: session.accessToken,
		refreshToken: session.refreshToken,
		sessionId: session.sessionId,
		accessTokenExpiresAt: session.accessTokenExpiresAt,
		refreshTokenExpiresAt: session.refreshTokenExpiresAt,
	};
}

async function writeConsoleNativeSession(
	page: ConsoleLoginPageLike,
	session: AdminNativeAuthSession,
) {
	const raw = await readConsolePersist(page);
	const document = mergeAdminPersistAuthSession(raw, session);

	await page.evaluate(
		({ storageKey, value }) => {
			window.localStorage.setItem(storageKey, value);
		},
		{
			storageKey: CONSOLE_PERSIST_KEY,
			value: JSON.stringify(document),
		},
	);
}

async function readConsoleAccessToken(page: ConsoleLoginPageLike) {
	const accessToken = readAdminPersistAccessToken(
		await readConsolePersist(page),
	);

	if (!accessToken) {
		throw new Error("Failed to read native access token from console persist.");
	}

	return accessToken;
}

async function readConsolePersist(page: ConsoleLoginPageLike) {
	return page.evaluate(
		(storageKey) => window.localStorage.getItem(storageKey),
		CONSOLE_PERSIST_KEY,
	);
}
