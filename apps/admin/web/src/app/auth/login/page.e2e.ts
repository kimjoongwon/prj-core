import { expect, test } from "@playwright/test";

test.describe("로그인 페이지 테스트", () => {
	test("로그인 페이지 진입 시 native 로그인 폼이 표시되어야 한다", async ({
		page,
	}) => {
		await page.goto("auth/login");

		await expect(
			page.getByRole("heading", { name: "관리자 로그인", exact: true }),
		).toBeVisible({ timeout: 30000 });
		await expect(page.getByLabel("Email")).toBeVisible();
		await expect(page.getByLabel("Password")).toBeVisible();
		await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
	});
});
