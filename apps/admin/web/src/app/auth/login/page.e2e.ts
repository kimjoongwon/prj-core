import { expect, test } from "@playwright/test";

// 로그인 페이지는 미인증 방문자 화면이므로 storage state(OP 세션) 없이
// 검증한다. 세션이 있으면 OIDC 인가가 자동 재개되어 페이지가 앱으로 튕긴다.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("로그인 페이지 테스트 @real", () => {
	test("로그인 페이지에서 인증 부트스트랩 API가 호출되지 않아야 한다", async ({
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

		await expect(
			page.getByRole("heading", { name: "관리자 로그인", exact: true }),
		).toBeVisible({ timeout: 30000 });
		// 부트스트랩이 hydration 직후 바로 발사되던 이전 동작을 잡기 위해
		// 렌더 확인 후에도 잠시 관찰한다.
		await page.waitForTimeout(1500);

		expect(authenticatedApiRequests).toEqual([]);
	});
});
