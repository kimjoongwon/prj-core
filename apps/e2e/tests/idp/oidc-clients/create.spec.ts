import { test, expect } from "@playwright/test";
import { loginToConsole } from "../helpers/login";

test.describe("OIDC 클라이언트 등록 페이지", () => {
	test("등록 폼이 렌더링되어야 한다", async ({ page }) => {
		// Given: 로그인 후 등록 페이지 진입
		await loginToConsole(page);
		await page.goto("/oidc-clients/new");
		await page.waitForLoadState("networkidle");

		// Then: 등록 페이지 확인
		await expect(page.getByText("클라이언트 등록")).toBeVisible();
	});
});
