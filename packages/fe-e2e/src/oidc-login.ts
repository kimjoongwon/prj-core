type UrlMatcher = string | RegExp | ((url: URL) => boolean);

interface Actionable {
	waitFor(options?: {
		state?: "visible" | "hidden";
		timeout?: number;
	}): Promise<void>;
	click(): Promise<void>;
}

interface InputActionable extends Actionable {
	clear(): Promise<void>;
	fill(value: string): Promise<void>;
}

export interface E2EPageLike {
	url(): string;
	goto(
		path: string,
		options?: { waitUntil?: "load" | "domcontentloaded" },
	): Promise<unknown>;
	waitForTimeout(ms: number): Promise<void>;
	waitForURL(url: UrlMatcher, options?: { timeout?: number }): Promise<void>;
	getByRole(role: string, options?: { name?: string }): Actionable;
	getByLabel(label: string): InputActionable;
}

interface OidcFlowOptions {
	startPath: string;
	finalUrl?: UrlMatcher;
	allowDirectRedirect?: boolean;
	retryAttempts?: number;
	retryDelayMs?: number;
	timeoutMs?: number;
	email?: string;
	password?: string;
}

const DEFAULT_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@plate.com";
const DEFAULT_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "rkdmf12!@";
const DEFAULT_TIMEOUT_MS = 60000;
type OidcEntryPoint = "login" | "consent" | "authenticated";

function getLoginButton(page: E2EPageLike) {
	return page.getByRole("button", { name: "로그인" });
}

function getAllowButton(page: E2EPageLike) {
	return page.getByRole("button", { name: "허용" });
}

function getTimeoutMs(timeoutMs?: number) {
	return timeoutMs ?? DEFAULT_TIMEOUT_MS;
}

/**
 * OP 세션이 살아 있으면 인가 요청이 로그인/동의 폼 없이 finalUrl로
 * 자동 재개된다. 이 경우 폼 대기를 건너뛰고 이미 로그인된 것으로 처리한다.
 */
function isFinalUrlReached(page: E2EPageLike, finalUrl?: UrlMatcher): boolean {
	if (!finalUrl) {
		return false;
	}

	const currentUrl = page.url();
	if (typeof finalUrl === "function") {
		return finalUrl(new URL(currentUrl));
	}
	if (finalUrl instanceof RegExp) {
		return finalUrl.test(currentUrl);
	}
	return currentUrl === finalUrl;
}

export async function navigateToOidcLoginForm(
	page: E2EPageLike,
	options: Pick<
		OidcFlowOptions,
		"startPath" | "retryAttempts" | "retryDelayMs" | "timeoutMs" | "finalUrl"
	>,
): Promise<OidcEntryPoint> {
	const {
		startPath,
		retryAttempts = 1,
		retryDelayMs = 1000,
		timeoutMs,
	} = options;
	let lastError: unknown;

	for (let attempt = 1; attempt <= retryAttempts; attempt++) {
		try {
			await page.goto(startPath, { waitUntil: "domcontentloaded" });
			lastError = null;
			break;
		} catch (error) {
			lastError = error;
			if (attempt === retryAttempts) {
				throw error;
			}
			await page.waitForTimeout(retryDelayMs);
		}
	}

	if (lastError) {
		throw lastError;
	}

	const deadline = Date.now() + getTimeoutMs(timeoutMs);
	while (Date.now() < deadline) {
		if (isFinalUrlReached(page, options.finalUrl)) {
			return "authenticated";
		}

		const remaining = Math.max(500, deadline - Date.now());
		const chunkTimeout = Math.min(remaining, 1000);
		const [loginResult, consentResult] = await Promise.allSettled([
			getLoginButton(page).waitFor({
				state: "visible",
				timeout: chunkTimeout,
			}),
			getAllowButton(page).waitFor({
				state: "visible",
				timeout: chunkTimeout,
			}),
		]);

		if (loginResult.status === "fulfilled") {
			return "login";
		}

		if (consentResult.status === "fulfilled") {
			return "consent";
		}
	}

	throw new Error(
		"OIDC login did not render a login or consent screen in time.",
	);
}

export async function submitOidcCredentials(
	page: E2EPageLike,
	options?: Pick<OidcFlowOptions, "email" | "password">,
) {
	const email = options?.email ?? DEFAULT_EMAIL;
	const password = options?.password ?? DEFAULT_PASSWORD;
	const emailInput = page.getByLabel("이메일");
	const passwordInput = page.getByLabel("비밀번호");

	const maxAttempts = 3;
	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			await emailInput.clear();
			await emailInput.fill(email);
			await passwordInput.clear();
			await passwordInput.fill(password);
			await getLoginButton(page).click();
			return;
		} catch (error) {
			if (attempt === maxAttempts) {
				throw error;
			}
			// 로그인 폼이 다시 로드되었을 수 있으므로 잠시 대기 후 재시도
			await page.waitForTimeout(250);
		}
	}
}

export async function waitForOidcConsentForm(
	page: E2EPageLike,
	options?: Pick<OidcFlowOptions, "timeoutMs">,
) {
	await getAllowButton(page).waitFor({
		state: "visible",
		timeout: getTimeoutMs(options?.timeoutMs),
	});
}

export async function runOidcLoginFlow(
	page: E2EPageLike,
	options: OidcFlowOptions,
) {
	const retryAttempts = options.retryAttempts ?? 1;
	const retryDelayMs = options.retryDelayMs ?? 1000;
	let lastError: unknown;

	for (let attempt = 1; attempt <= retryAttempts; attempt++) {
		try {
			const entryPoint = await navigateToOidcLoginForm(page, {
				startPath: options.startPath,
				retryAttempts: 1,
				retryDelayMs,
				timeoutMs: options.timeoutMs,
				finalUrl: options.finalUrl,
			});
			if (entryPoint === "login") {
				await submitOidcCredentials(page, options);
			} else if (entryPoint === "consent") {
				await waitForOidcConsentForm(page, options);
			}
			// "authenticated": 폼 없이 finalUrl에 자동 재개되었으므로 그대로 진행한다.

			if (!options.finalUrl) {
				await waitForOidcConsentForm(page, options);
				return;
			}

			const allowDirectRedirect = options.allowDirectRedirect ?? true;
			const timeoutMs = getTimeoutMs(options.timeoutMs);

			if (allowDirectRedirect) {
				try {
					await page.waitForURL(options.finalUrl, {
						timeout: Math.min(5000, timeoutMs),
					});
					return;
				} catch {
					// Consent still required, fall through to consent loop.
				}
			}

			await resolveOidcConsent(page, options.finalUrl, timeoutMs);
			return;
		} catch (error) {
			lastError = error;
			if (attempt === retryAttempts) {
				throw error;
			}
			await page.waitForTimeout(retryDelayMs);
		}
	}

	throw lastError;
}

async function resolveOidcConsent(
	page: E2EPageLike,
	finalUrl: UrlMatcher,
	timeoutMs: number,
) {
	const deadline = Date.now() + timeoutMs;
	const allowButton = getAllowButton(page);

	while (Date.now() < deadline) {
		const remaining = Math.max(500, deadline - Date.now());

		try {
			await page.waitForURL(finalUrl, { timeout: remaining });
			return;
		} catch {
			// Still waiting for the final URL; continue to consent handling.
		}

		try {
			await allowButton.waitFor({
				state: "visible",
				timeout: Math.min(remaining, 1000),
			});
			await allowButton.click();
		} catch {
			// Allow 버튼이 아직 렌더링되지 않았으면 잠시 대기 후 재시도
			await page.waitForTimeout(100);
		}
	}

	throw new Error("OIDC consent flow did not reach the target URL in time.");
}
