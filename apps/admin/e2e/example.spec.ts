import { expect, test } from "@playwright/test";

test.describe("Admin 페이지 기본 테스트", () => {
	test("메인 페이지 로드 확인", async ({ page }) => {
		await page.goto("./");
		await expect(page).toHaveURL(/.*admin/);
	});

	test("페이지 타이틀 확인", async ({ page }) => {
		await page.goto("./");
		await expect(page).toHaveTitle(/.*/);
	});
});
