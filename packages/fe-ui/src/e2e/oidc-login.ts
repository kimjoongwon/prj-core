type UrlMatcher = string | RegExp | ((url: URL) => boolean);

interface Actionable {
	waitFor(options?: { state?: "visible" | "hidden"; timeout?: number }): Promise<void>;
	click(): Promise<void>;
}

interface InputActionable extends Actionable {
	clear(): Promise<void>;
	fill(value: string): Promise<void>;
}

export interface E2EPageLike {
	goto(path: string): Promise<unknown>;
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
const DEFAULT_TIMEOUT_MS = 30000;

function getLoginButton(page: E2EPageLike) {
	return page.getByRole("button", { name: "로그인" });
}

function getAllowButton(page: E2EPageLike) {
	return page.getByRole("button", { name: "허용" });
}

function getTimeoutMs(timeoutMs?: number) {
	return timeoutMs ?? DEFAULT_TIMEOUT_MS;
}

export async function navigateToOidcLoginForm(
	page: E2EPageLike,
	options: Pick<
		OidcFlowOptions,
		"startPath" | "retryAttempts" | "retryDelayMs" | "timeoutMs"
	>,
) {
	const {
		startPath,
		retryAttempts = 1,
		retryDelayMs = 1000,
		timeoutMs,
	} = options;
	let lastError: unknown;

	for (let attempt = 1; attempt <= retryAttempts; attempt++) {
		try {
			await page.goto(startPath);
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

	await getLoginButton(page).waitFor({
		state: "visible",
		timeout: getTimeoutMs(timeoutMs),
	});
}

export async function submitOidcCredentials(
	page: E2EPageLike,
	options?: Pick<OidcFlowOptions, "email" | "password">,
) {
	const email = options?.email ?? DEFAULT_EMAIL;
	const password = options?.password ?? DEFAULT_PASSWORD;
	const emailInput = page.getByLabel("이메일");
	const passwordInput = page.getByLabel("비밀번호");

	await emailInput.clear();
	await emailInput.fill(email);
	await passwordInput.clear();
	await passwordInput.fill(password);
	await getLoginButton(page).click();
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
	await navigateToOidcLoginForm(page, options);
	await submitOidcCredentials(page, options);

	if (!options.finalUrl) {
		await waitForOidcConsentForm(page, options);
		return;
	}

	const allowDirectRedirect = options.allowDirectRedirect ?? true;
	const allowButton = getAllowButton(page);
	const timeoutMs = getTimeoutMs(options.timeoutMs);

	if (allowDirectRedirect) {
		let redirectedToTarget = false;
		await Promise.race([
			page.waitForURL(options.finalUrl, { timeout: timeoutMs }).then(() => {
				redirectedToTarget = true;
			}),
			allowButton.waitFor({ state: "visible", timeout: timeoutMs }),
		]);

		if (!redirectedToTarget) {
			await allowButton.click();
			await page.waitForURL(options.finalUrl, { timeout: timeoutMs });
		}
		return;
	}

	await allowButton.waitFor({ state: "visible", timeout: timeoutMs });
	await allowButton.click();
	await page.waitForURL(options.finalUrl, { timeout: timeoutMs });
}
