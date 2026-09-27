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

	test("로그아웃 이후 늦게 도착하는 401이 end_session 이동을 대체하지 않는다", async ({
		page,
	}) => {
		await loginToConsole(page);
		await expect(
			page.getByRole("button", { name: "사용자 메뉴" }),
		).toBeVisible({ timeout: 20000 });

		// 로그아웃 클릭 이후에야 응답이 도착하는 인증 API 요청을 만든다.
		// 로그아웃이 인증 쿠키를 지운 뒤 401로 돌아오면 세션 만료 핸들러가
		// 로그인 화면으로 내비게이션하려 하는데, 의도적 로그아웃 표시가 있으면
		// 억제되고 OP end_session 체인이 완결돼야 한다(회귀: 억제가 없으면 SSO
		// 자동 재개로 곧바로 대시보드로 돌아왔다).
		let lateUsersResponseStatus = 0;
		await page.route(/\/api\/v1\/users/, async (route) => {
			// users 조회가 로그아웃 이후에 도착하도록 지연한다.
			await new Promise((resolve) => setTimeout(resolve, 5000));
			const response = await route.fetch();
			lateUsersResponseStatus = response.status();
			await route.fulfill({ response }).catch(() => {});
		});
		// end_session 문서 로딩을 지연시켜 구 페이지(로그아웃 버튼을 누른
		// 페이지)가 살아 있는 동안 늦은 401이 도착하게 한다. 이 창 안에서
		// 세션 만료 핸들러가 내비게이션을 대체하면 로그아웃이 취소된다.
		await page.route(/\/oidc\/session\/end/, async (route) => {
			await new Promise((resolve) => setTimeout(resolve, 4000));
			await route.continue();
		});

		// 지연 중인 users 조회를 띄운 채 로그아웃한다.
		await page.goto("./users");
		await page.getByRole("button", { name: "사용자 메뉴" }).waitFor({
			state: "visible",
			timeout: 20000,
		});
		await page.getByRole("button", { name: "사용자 메뉴" }).click();
		await page
			.getByRole("menuitem", { name: "로그아웃" })
			.waitFor({ state: "visible", timeout: 8000 });
		await page.getByRole("menuitem", { name: "로그아웃" }).click();

		await expect(page.getByLabel("이메일")).toBeVisible({ timeout: 30000 });

		// 늦은 응답이 401로 도착했는지(경합 조건이 성립했는지) 확인한다.
		await expect
			.poll(() => lateUsersResponseStatus, { timeout: 10000 })
			.toBe(401);
		// 대시보드로 되돌아가지 않았는지가 이 회귀의 핵심 판정이다.
		await expect(page).not.toHaveURL(/dashboard/);
	});
});
