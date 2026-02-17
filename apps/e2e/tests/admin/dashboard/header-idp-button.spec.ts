import { test, expect } from "@playwright/test";

test.describe("헤더 IDP 관리 버튼", () => {
	test.beforeEach(async ({ page }) => {
		// Given: 관리자 대시보드 진입 (루트는 로그인으로 리다이렉트됨)
		await page.goto("./dashboard");
		await page.waitForLoadState("networkidle");
	});

	test("IDP 관리 버튼이 헤더에 표시되어야 한다", async ({ page }) => {
		// Then: IDP 관리 버튼이 보임
		const idpButton = page.getByRole("button", {
			name: "IDP 관리 콘솔 열기",
		});
		await expect(idpButton).toBeVisible();
	});

	test("IDP 관리 버튼 클릭 시 새 탭이 열려야 한다", async ({
		page,
		context,
	}) => {
		// Given: IDP 관리 버튼 찾기
		const idpButton = page.getByRole("button", {
			name: "IDP 관리 콘솔 열기",
		});

		// When: 버튼 클릭 시 새 탭 열림을 감지
		const [newPage] = await Promise.all([
			context.waitForEvent("page"),
			idpButton.click(),
		]);

		// Then: 새 탭이 IDP Client URL로 열림
		expect(newPage.url()).toContain("localhost:3008");
	});
});
