import { expect, test } from "@playwright/test";

test.describe("/translations", () => {
	test("정적 번역 관리 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
		await page.goto("/translations");

		await expect(
			page.getByRole("heading", { name: "정적 번역" }),
		).toBeVisible();
		await expect(page.getByPlaceholder("번역 키 검색...")).toBeVisible();
		await expect(page.getByRole("button", { name: "번역 등록" })).toBeVisible();
	});
});
