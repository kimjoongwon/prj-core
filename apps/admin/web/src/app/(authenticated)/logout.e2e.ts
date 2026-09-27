import { loginToConsole } from "@cocrepo/e2e";
import { expect, test } from "@playwright/test";

// 로그아웃 전 구간(RP 쿠키 정리 → OP end_session → OP 세션 파괴 → 재진입 시
// 자동 로그인 없음)을 검증한다. 로그인 직후 세션은 ID Token이 신선해
// id_token_hint 자동 진행 경로를 탄다. (만료된 ID Token 세션은 확인 화면을
// 거치는데, Redis 세션 조작이 필요해 자동 스펙에 넣지 않고 있다.)
test.describe("로그아웃 플로우 @real", () => {
	test("로그아웃 후 OP 세션까지 종료되고 재진입 시 로그인 폼으로 돌아간다", async ({
		page,
	}) => {
		await loginToConsole(page);
		await expect(
			page.getByRole("button", { name: "사용자 메뉴" }),
		).toBeVisible({ timeout: 20000 });

		// When: 계정 메뉴에서 로그아웃
		await page.getByRole("button", { name: "사용자 메뉴" }).click();
		await page
			.getByRole("menuitem", { name: "로그아웃" })
			.waitFor({ state: "visible", timeout: 8000 });
		await page.getByRole("menuitem", { name: "로그아웃" }).click();

		// end_session 자동제출 + post_logout_redirect → 로그인 페이지가 다시
		// OIDC 인가를 시작하므로 최종 착지는 로그인 폼(이메일 입력)이다.
		await expect(page.getByLabel("이메일")).toBeVisible({ timeout: 30000 });

		// Then: RP 쿠키가 정리됐다
		const authenticationCookies = (await page.context().cookies()).filter(
			(cookie) => /session|token|loggedIn/i.test(cookie.name),
		);
		expect(authenticationCookies).toEqual([]);

		// And: 재진입해도 자동 로그인되지 않는다(OP 세션 파괴 확인)
		await page.goto("./dashboard");
		await expect(page.getByLabel("이메일")).toBeVisible({ timeout: 30000 });
	});
});
