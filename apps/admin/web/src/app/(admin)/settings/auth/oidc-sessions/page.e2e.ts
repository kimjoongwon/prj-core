import { loginToConsole } from "@cocrepo/e2e";
import { expect, test } from "@playwright/test";

test.describe("OIDC 세션 관리", () => {
	test.describe("목록 페이지", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 로그인 후 세션 관리 페이지 진입
			await loginToConsole(page);
			await page.goto("./settings/auth/oidc-sessions");
			await page.waitForLoadState("networkidle");
		});

		test("페이지 타이틀이 표시되어야 한다", async ({ page }) => {
			// Then: 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "OIDC 세션/토큰" }),
			).toBeVisible();
			await expect(
				page.getByText("OIDC 세션 및 토큰을 조회하고 관리합니다"),
			).toBeVisible();
		});

		test("로그인 후 세션 데이터가 표시되어야 한다", async ({ page }) => {
			// Then: 로그인으로 생성된 OIDC 세션이 존재함
			// DataGrid 컬럼 헤더가 보이면 데이터 로드 완료
			await expect(
				page.getByRole("columnheader", { name: "키" }),
			).toBeVisible();
			await expect(
				page.getByRole("columnheader", { name: "모델 타입" }),
			).toBeVisible();
			await expect(
				page.getByRole("columnheader", { name: "Account ID" }),
			).toBeVisible();
		});
	});

});
