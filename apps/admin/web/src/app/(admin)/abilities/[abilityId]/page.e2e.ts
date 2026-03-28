import { expect, type Page, test } from "@playwright/test";

function getAbilitiesHeading(page: Page) {
	return page.getByRole("heading", {
		name: "권한 목록",
		exact: true,
		level: 1,
	});
}

async function gotoAbilitiesPage(page: Page) {
	await page.goto("./abilities", { waitUntil: "domcontentloaded" });
	await expect(getAbilitiesHeading(page)).toBeVisible();
}

test.describe("권한 상세 페이지", () => {
	test("목록 행 클릭 시 상세 페이지로 이동해야 한다", async ({ page }) => {
		// Given: 권한 목록 페이지
		await gotoAbilitiesPage(page);

		// When: 첫 번째 목록 행을 클릭
		const firstRow = page.locator("table tbody tr").first();
		await expect(firstRow).toBeVisible();
		await Promise.all([
			page.waitForURL(/\/abilities\/[^/]+$/),
			firstRow.click(),
		]);

		// Then: 상세 페이지 URL 확인
		await expect(page).toHaveURL(/\/abilities\//);
		await expect(
			page.getByRole("heading", { name: "권한 상세" }),
		).toBeVisible();
	});
});
