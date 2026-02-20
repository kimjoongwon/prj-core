import type { Page } from "@playwright/test";

/** 시드 데이터 기준 FULL_ACCESS 계정 */
const ADMIN_EMAIL = "admin@plate.com";
const ADMIN_PASSWORD = "rkdmf12!@";

/** 시드 데이터 기준 System Space (플랫폼 운영본부) */
const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";
const SYSTEM_GROUND_NAME = "플랫폼 운영본부";

/**
 * Admin 앱에 OIDC 로그인 플로우를 수행합니다.
 *
 * 1. /admin/auth/login → /api/v1/auth/login → IDP /interaction/[uid]
 * 2. 시드 데이터의 FULL_ACCESS 계정으로 로그인
 * 3. OIDC 동의 화면에서 "허용" 클릭
 * 4. Admin 대시보드로 리다이렉트
 * 5. localStorage에 Space 정보 설정 (X-Space-ID 헤더용)
 */
export async function loginToAdmin(page: Page) {
	// OIDC 로그인 플로우 시작 (admin의 auth/login은 자동 리다이렉트)
	await page.goto("./auth/login");

	// OIDC 리다이렉트 후 IDP 로그인 폼이 나타날 때까지 대기
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
	// 이미 동의한 경우에는 바로 리다이렉트되므로 조건부 처리
	try {
		const allowButton = page.getByRole("button", { name: "허용" });
		await allowButton.waitFor({ state: "visible", timeout: 10000 });
		await allowButton.click();
	} catch {
		// 이미 동의한 경우 스킵
	}

	// Admin 페이지로 리다이렉트 대기 (로그인 페이지가 아닌 곳으로)
	await page.waitForURL(
		(url) =>
			url.pathname.startsWith("/admin") &&
			!url.pathname.includes("/auth/login"),
		{ timeout: 30000 },
	);

	// localStorage에 Space 정보 설정 (PersistStore가 사용)
	await page.evaluate(
		({ spaceId, groundName }) => {
			const persistData = {
				spaceId,
				groundName,
				spaces: [{ spaceId, groundName }],
				accessTokenExpiresAt: Date.now() + 3600000,
				refreshTokenExpiresAt: Date.now() + 86400000,
			};
			localStorage.setItem("admin-persist", JSON.stringify(persistData));
		},
		{ spaceId: SYSTEM_SPACE_ID, groundName: SYSTEM_GROUND_NAME },
	);

	// 페이지 리로드하여 PersistStore가 localStorage에서 spaceId를 읽도록 함
	await page.reload();
	await page.waitForLoadState("networkidle");
}
