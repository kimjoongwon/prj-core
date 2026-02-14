import { test, expect } from "@playwright/test";
import { loginToConsole } from "./helpers/login";

/** 세션 데이터 모킹용 응답 */
const MOCK_SESSIONS = {
	httpStatus: 200,
	message: "성공",
	data: [
		{
			key: "session-abc12345-def67890",
			modelType: "Session",
			grantId: "grant-xyz11111-aaa22222",
			expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			key: "access-bbb33333-ccc44444",
			modelType: "AccessToken",
			grantId: "grant-xyz11111-aaa22222",
			expiresAt: new Date(Date.now() + 1800 * 1000).toISOString(),
			createdAt: new Date().toISOString(),
		},
	],
	meta: { totalCount: 2, take: 20, skip: 0 },
};

/**
 * 세션 API를 모킹하고 페이지를 로드합니다.
 * SSR prefetch를 우회하기 위해 route 설정 후 reload합니다.
 */
async function setupMockedSessionsPage(
	page: import("@playwright/test").Page,
) {
	await loginToConsole(page);

	// API 모킹 설정 (GET /api/v1/oidc-sessions)
	await page.route("**/api/v1/oidc-sessions*", (route) => {
		if (route.request().method() === "GET") {
			return route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify(MOCK_SESSIONS),
			});
		}
		return route.continue();
	});

	// 페이지 이동 후 클라이언트 사이드 refetch 대기
	await page.goto("/oidc-sessions");

	// SSR prefetch 데이터가 stale이면 클라이언트가 refetch함
	// 모킹된 데이터가 로드될 때까지 대기
	await page.waitForTimeout(2000);

	// 여전히 빈 상태면 reload하여 모킹 데이터 적용
	const hasData = await page.getByText("session-abc").isVisible().catch(() => false);
	if (!hasData) {
		await page.reload();
		await page.waitForLoadState("networkidle");
	}
}

test.describe("OIDC 세션 관리", () => {
	test.describe("목록 페이지", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 로그인 후 세션 관리 페이지 진입
			await loginToConsole(page);
			await page.goto("/oidc-sessions");
			await page.waitForLoadState("networkidle");
		});

		test("페이지 타이틀이 표시되어야 한다", async ({ page }) => {
			// Then: 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "OIDC 세션/토큰" }),
			).toBeVisible();
			await expect(
				page.getByText("OIDC 세션 및 토큰을 조회하고 관리합니다"),
			).toBeVisible();
		});

		test("세션 데이터가 없을 때 빈 상태가 표시되어야 한다", async ({
			page,
		}) => {
			// Then: 빈 상태 안내 메시지 확인
			await expect(
				page.getByText("등록된 OIDC 세션/토큰이 없습니다"),
			).toBeVisible();
		});
	});

	test.describe("세션 폐기", () => {
		test("개별 세션 폐기 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 세션 데이터가 있는 페이지
			await setupMockedSessionsPage(page);

			// Then: 각 행에 폐기 버튼이 존재
			const revokeButtons = page.getByRole("button", { name: "폐기" });
			await expect(revokeButtons.first()).toBeVisible({ timeout: 10000 });
			expect(await revokeButtons.count()).toBe(2);
		});

		test("Grant ID 클릭 시 일괄 폐기 모달이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 세션 데이터가 있는 페이지
			await setupMockedSessionsPage(page);

			// When: Grant ID 버튼 클릭
			const grantButton = page
				.getByRole("button", { name: /grant-xy/ })
				.first();
			await expect(grantButton).toBeVisible({ timeout: 10000 });
			await grantButton.click();

			// Then: 일괄 폐기 확인 모달 표시
			await expect(page.getByText("Grant 일괄 폐기")).toBeVisible();
			await expect(
				page.getByText("일괄 폐기하시겠습니까"),
			).toBeVisible();
		});
	});
});
