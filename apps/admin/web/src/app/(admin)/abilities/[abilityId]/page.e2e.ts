import { expect, test } from "@playwright/test";

test.describe("권한 상세 페이지", () => {
	test("목록에서 상세 버튼 클릭 시 상세 페이지로 이동해야 한다", async ({
		page,
	}) => {
		// Given: 권한 목록 페이지
		await page.goto("./abilities");
		await page.waitForLoadState("networkidle");

		// When: 첫 번째 항목의 상세 버튼 클릭
		const detailButton = page.getByRole("button", { name: "상세" }).first();
		await expect(detailButton).toBeVisible();
		await detailButton.click();
		await page.waitForLoadState("networkidle");

		// Then: 상세 페이지 URL 확인
		await expect(page).toHaveURL(/\/abilities\//);
	});
});
