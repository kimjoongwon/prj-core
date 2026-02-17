import { test, expect } from "@playwright/test";

test.describe("Action 등록 페이지", () => {
	test("Action 등록 페이지에서 폼이 렌더링되어야 한다", async ({
		page,
	}) => {
		// Given: Action 등록 페이지
		await page.goto("./actions/new");
		await page.waitForLoadState("networkidle");

		// Then: 페이지 타이틀 확인
		await expect(
			page.getByRole("heading", { name: "Action 등록" }),
		).toBeVisible();

		// Then: 폼 필드 확인
		await expect(
			page.getByRole("textbox", { name: /행위 식별자/ }),
		).toBeVisible();
		await expect(
			page.getByRole("textbox", { name: "표시명" }),
		).toBeVisible();
	});
});
