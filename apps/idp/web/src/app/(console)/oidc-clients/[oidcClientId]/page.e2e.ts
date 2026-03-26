import { loginToConsole } from "@cocrepo/e2e";
import { expect, test } from "@playwright/test";

test.describe("OIDC 클라이언트 상세 페이지", () => {
	test("클라이언트 상세 정보가 표시되어야 한다", async ({ page }) => {
		// Given: 로그인 후 목록 페이지 진입
		await loginToConsole(page);
		await page.goto("/oidc-clients");
		await page.waitForLoadState("domcontentloaded");

		// When: 첫 번째 클라이언트의 상세 링크를 따라 상세 페이지 진입
		const detailLink = page.locator('a[aria-label="상세 보기"]').first();
		await expect(detailLink).toBeVisible({ timeout: 10000 });
		const href = await detailLink.getAttribute("href");
		expect(href).toBeTruthy();
		await page.goto(href as string);
		await page.waitForLoadState("domcontentloaded");

		// Then: 상세 페이지로 이동하고 정보가 표시됨
		await expect(page).toHaveURL(/\/oidc-clients\/.+/);
		await expect(page.getByText("Client ID")).toBeVisible();
	});
});
