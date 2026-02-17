import { test, expect } from "@playwright/test";
import { loginToConsole } from "../helpers/login";

test.describe("OIDC 클라이언트 상세 페이지", () => {
	test("클라이언트 상세 정보가 표시되어야 한다", async ({ page }) => {
		// Given: 로그인 후 목록 페이지 진입
		await loginToConsole(page);
		await page.goto("/oidc-clients");
		await page.waitForLoadState("networkidle");

		// When: 첫 번째 클라이언트의 "상세 보기" 클릭
		await page
			.getByRole("button", { name: "상세 보기" })
			.first()
			.click();

		// Then: 상세 페이지로 이동하고 정보가 표시됨
		await expect(page).toHaveURL(/\/oidc-clients\/.+/);
		await expect(page.getByText("Client ID")).toBeVisible();
	});
});
