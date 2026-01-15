import { test, expect } from "@playwright/test";

test.describe("로그인 페이지 테스트", () => {
	test("로그인 페이지 진입 확인", async ({ page }) => {
		// Given: 로그인 페이지로 이동
		await page.goto("/auth/login");

		// Then: 로그인 페이지가 정상 로드됨
		await expect(page.getByText("관리자 로그인")).toBeVisible();
		await expect(page.getByText("관리자 계정으로 로그인하세요")).toBeVisible();

		// 스크린샷 저장
		await page.screenshot({ path: "screenshots/login-page.png" });
	});
});
