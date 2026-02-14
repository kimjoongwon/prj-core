import type { Page } from "@playwright/test";

/** 시드 데이터 기준 FULL_ACCESS 계정 */
const ADMIN_EMAIL = "admin@plate.com";
const ADMIN_PASSWORD = "rkdmf12!@";

/**
 * IDP 콘솔에 OIDC 로그인 플로우를 수행합니다.
 *
 * 1. /auth/login → OIDC 리다이렉트 → /interaction/[uid]
 * 2. 시드 데이터의 FULL_ACCESS 계정으로 로그인
 * 3. OIDC 동의 화면에서 "허용" 클릭
 * 4. 콘솔 페이지(/oidc-clients)로 리다이렉트
 */
export async function loginToConsole(page: Page) {
	// OIDC 로그인 플로우 시작
	await page.goto("/auth/login");

	// OIDC 리다이렉트 후 로그인 폼이 나타날 때까지 대기
	const loginButton = page.getByRole("button", { name: "로그인" });
	await loginButton.waitFor({ state: "visible", timeout: 30000 });

	// DEV 모드 자동 입력 값을 지우고 시드 데이터 계정 입력
	const emailInput = page.getByLabel("이메일");
	const passwordInput = page.getByLabel("비밀번호");

	await emailInput.clear();
	await emailInput.fill(ADMIN_EMAIL);
	await passwordInput.clear();
	await passwordInput.fill(ADMIN_PASSWORD);

	// 로그인 클릭
	await loginButton.click();

	// OIDC 동의 화면이 나타나면 "허용" 클릭
	const allowButton = page.getByRole("button", { name: "허용" });
	await allowButton.waitFor({ state: "visible", timeout: 30000 });
	await allowButton.click();

	// 콘솔 페이지로 리다이렉트 대기
	await page.waitForURL(/\/oidc-clients/, { timeout: 30000 });
}

/**
 * OIDC 로그인 폼 페이지로 이동합니다.
 * (로그인 제출 없이 폼만 표시)
 *
 * 1. /auth/login → OIDC 리다이렉트 → /interaction/[uid]
 * 2. 로그인 폼 렌더링 대기
 */
export async function navigateToLoginForm(page: Page) {
	await page.goto("/auth/login");

	// OIDC 리다이렉트 후 로그인 폼이 나타날 때까지 대기
	await page
		.getByRole("button", { name: "로그인" })
		.waitFor({ state: "visible", timeout: 30000 });
}
