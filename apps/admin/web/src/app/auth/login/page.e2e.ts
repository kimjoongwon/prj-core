import { expect, test } from "@playwright/test";

test.describe("로그인 페이지 테스트", () => {
	test("로그인 페이지 진입 시 IDP 로그인 페이지로 리다이렉트되어야 한다", async ({
		page,
	}) => {
		// Given: 로그인 페이지로 이동 (OIDC 플로우로 IDP 서버로 리다이렉트)
		await page.goto("auth/login");

		// Then: IDP 로그인 페이지가 표시됨
		await expect(
			page.getByRole("heading", { name: "로그인", exact: true }),
		).toBeVisible({ timeout: 30000 });

		// Then: IDP 로그인 폼이 표시됨
		await expect(page.getByLabel("이메일")).toBeVisible();
		await expect(page.getByLabel("비밀번호")).toBeVisible();
		await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
	});
});
