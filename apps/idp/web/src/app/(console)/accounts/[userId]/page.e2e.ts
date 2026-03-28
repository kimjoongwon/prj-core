import { loginToConsole } from "@cocrepo/e2e";
import { expect, test } from "@playwright/test";

const navigateToFirstAccountDetail = async (
	page: import("@playwright/test").Page,
): Promise<void> => {
	await page.goto("/accounts");
	await page.waitForLoadState("domcontentloaded");

	const detailLink = page.locator('a[href^="/accounts/"]').first();
	await expect(detailLink).toBeVisible({ timeout: 10000 });

	const href = await detailLink.getAttribute("href");
	expect(href).toBeTruthy();

	await page.goto(href as string);
	await page.waitForLoadState("domcontentloaded");
};

test.describe("IDP 계정 상세 페이지", () => {
	test("계정 상세 정보가 표시되어야 한다", async ({ page }) => {
		// Given: 로그인 후 상세 페이지 진입
		await loginToConsole(page);
		await navigateToFirstAccountDetail(page);

		// Then: 상세 페이지로 이동하고 보안 정보가 표시됨
		await expect(page).toHaveURL(/\/accounts\/.+/);
		await page.waitForLoadState("networkidle");

		// 보안 정보 섹션 확인
		await expect(page.getByText("보안 정보")).toBeVisible();
	});

	test("상세 페이지에서 액션 버튼이 표시되어야 한다", async ({ page }) => {
		// Given: 로그인 후 상세 페이지 진입
		await loginToConsole(page);
		await navigateToFirstAccountDetail(page);
		await page.waitForLoadState("networkidle");

		// Then: 액션 버튼 확인
		await expect(
			page.getByRole("button", { name: "목록으로", exact: true }),
		).toBeVisible();
	});
});
