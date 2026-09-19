import type { AdminPersistSpaceSelection } from "./admin-persist";
import {
	type E2EPageLike,
	navigateToOidcLoginForm,
	runOidcLoginFlow,
	submitOidcCredentials,
	waitForOidcConsentForm,
} from "./oidc-login";

interface ConsoleLoginPageLike extends E2EPageLike {
	evaluate<Result, Arg>(
		pageFunction: (arg: Arg) => Result,
		arg: Arg,
	): Promise<Result>;
	url(): string;
}

const DEFAULT_CONSOLE_BASE_URL =
	process.env.E2E_ADMIN_BASE_URL ?? "http://localhost:3000/admin";
const LOGIN_PATH =
	process.env.E2E_IDP_LOGIN_PATH ??
	"/api/v1/auth/oidc/login?clientId=admin-web";
const DASHBOARD_PATH = process.env.E2E_IDP_DASHBOARD_PATH ?? "/settings/auth";

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
const normalizedDashboardPath = ensureLeadingSlash(DASHBOARD_PATH);
const dashboardUrl = `${consoleBaseUrl}${normalizedDashboardPath}`;
const oidcLoginUrl = new URL(
	buildPathWithQuery(LOGIN_PATH, {
		returnTo: dashboardUrl,
	}),
	consoleOrigin,
).toString();

const CONSENT_TIMEOUT_MS = 30000;
const DEFAULT_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@plate.com";
const DEFAULT_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "rkdmf12!@";
const CONSOLE_PERSIST_KEY = "admin-persist";

/**
 * Admin console에 OIDC UI 로그인하고 앱이 자동 선택한 System FitnessCenter
 * context가 저장될 때까지 기다립니다.
 *
 * @param page Admin console을 제어할 E2E page
 * @returns 앱 부트스트랩이 확정한 tenant/space 선택값
 */
export async function loginToConsole(
	page: ConsoleLoginPageLike,
): Promise<AdminPersistSpaceSelection> {
	for (let attempt = 1; attempt <= 3; attempt++) {
		try {
			await runOidcLoginFlow(page, {
				startPath: oidcLoginUrl,
				email: DEFAULT_EMAIL,
				password: DEFAULT_PASSWORD,
				finalUrl: (url: URL) =>
					url.origin === consoleOrigin &&
					url.pathname.endsWith(normalizedDashboardPath),
			});
			const selection = await waitForConsoleSpaceSelection(page);
			await page.goto(dashboardUrl, {
				waitUntil: "domcontentloaded",
			});
			return selection;
		} catch (error) {
			if (attempt === 3) {
				throw error;
			}
			await page.waitForTimeout(1000);
		}
	}

	throw new Error("Console OIDC login failed after retries.");
}

/**
 * OIDC 로그인 이후 앱의 session/space 부트스트랩이 admin-persist에
 * tenant/space 선택을 기록할 때까지 폴링합니다.
 */
async function waitForConsoleSpaceSelection(
	page: ConsoleLoginPageLike,
): Promise<AdminPersistSpaceSelection> {
	const deadline = Date.now() + CONSENT_TIMEOUT_MS;
	while (Date.now() < deadline) {
		const selection = await page.evaluate((storageKey) => {
			const raw = window.localStorage.getItem(storageKey);
			if (!raw) {
				return null;
			}

			try {
				const parsed = JSON.parse(raw) as {
					account?: {
						tenantId?: unknown;
						spaceId?: unknown;
						fitnessCenterName?: unknown;
						contentLanguageCode?: unknown;
					};
				};
				const account = parsed.account;
				if (
					typeof account?.tenantId === "string" &&
					typeof account.spaceId === "string" &&
					typeof account.fitnessCenterName === "string"
				) {
					return {
						tenantId: account.tenantId,
						spaceId: account.spaceId,
						fitnessCenterName: account.fitnessCenterName,
						contentLanguageCode:
							typeof account.contentLanguageCode === "string"
								? account.contentLanguageCode
								: null,
					};
				}
			} catch {
				return null;
			}

			return null;
		}, CONSOLE_PERSIST_KEY);

		if (selection) {
			return selection;
		}

		await page.waitForTimeout(500);
	}

	throw new Error(
		"Console space selection was not established after OIDC login.",
	);
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
