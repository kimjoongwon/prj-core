import { expect, test } from "@playwright/test";

// 로그인 진입은 미인증 방문자 경로이므로 storage state(OP 세션) 없이
// 검증한다. 세션이 있으면 OIDC 인가가 자동 재개되어 페이지가 앱으로 튕긴다.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("로그인 진입 리다이렉트 테스트 @real", () => {
	test("로그인 진입은 렌더 없이 IDP 로그인 폼으로 이동해야 한다", async ({
		page,
	}) => {
		const authenticatedApiRequests: string[] = [];
		page.on("request", (request) => {
			const url = request.url();
			if (
				url.endsWith("/api/v1/auth/my-spaces") ||
				url.endsWith("/api/v1/auth/current-space") ||
				url.endsWith("/api/v1/auth/verify-token") ||
				url.endsWith("/api/v1/abilities/my")
			) {
				authenticatedApiRequests.push(url);
			}
		});

		await page.goto("auth/login");

		// 서버 307 체인(/auth/login -> core-api oidc/login -> IDP authorize)을
		// 따라 로그인 폼(이메일 입력)에 도달해야 한다.
		await expect(page.getByLabel("이메일")).toBeVisible({ timeout: 30000 });
		// 부트스트랩이 렌더 직후 바로 발사되던 이전 동작을 잡기 위해
		// 도달 확인 후에도 잠시 관찰한다.
		await page.waitForTimeout(1500);

		expect(authenticatedApiRequests).toEqual([]);
	});
});
