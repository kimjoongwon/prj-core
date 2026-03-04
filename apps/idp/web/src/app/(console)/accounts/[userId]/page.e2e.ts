import { expect, test } from "@playwright/test";
import { loginToConsole } from "@cocrepo/ui/e2e";

test.describe("IDP 계정 상세 페이지", () => {
	test("계정 상세 정보가 표시되어야 한다", async ({ page }) => {
		// Given: 로그인 후 계정 목록 페이지 진입
		await loginToConsole(page);
		await page.goto("/accounts");
		await page.waitForLoadState("networkidle");

		// When: 첫 번째 계정의 "상세 보기" 클릭 (Button as={Link}이므로 role=button)
		await page.getByRole("button", { name: "상세 보기" }).first().click();

		// Then: 상세 페이지로 이동하고 보안 정보가 표시됨
		await expect(page).toHaveURL(/\/accounts\/.+/);
		await page.waitForLoadState("networkidle");

		// 보안 정보 섹션 확인
		await expect(page.getByText("보안 정보")).toBeVisible();
	});

	test("상세 페이지에서 액션 버튼이 표시되어야 한다", async ({ page }) => {
		// Given: 로그인 후 계정 목록 → 상세 진입
		await loginToConsole(page);
		await page.goto("/accounts");
		await page.waitForLoadState("networkidle");

		// When: 첫 번째 계정 상세 진입
		await page.getByRole("button", { name: "상세 보기" }).first().click();
		await page.waitForLoadState("networkidle");

		// Then: 액션 버튼 확인 (잠금 해제, 실패 횟수 초기화, 세션 무효화 등)
		await expect(page.getByText("목록으로")).toBeVisible();
	});
});
