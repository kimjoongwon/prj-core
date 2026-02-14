import { test, expect } from "@playwright/test";
import { loginToConsole } from "./helpers/login";

test.describe("OIDC 세션 관리", () => {
	test.describe("목록 페이지", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 로그인 후 세션 관리 페이지 진입
			await loginToConsole(page);
			await page.goto("/oidc-sessions");
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

		test("세션 데이터가 없을 때 빈 상태가 표시되어야 한다", async ({
			page,
		}) => {
			// Then: 빈 상태 안내 메시지 확인
			await expect(
				page.getByText("등록된 OIDC 세션/토큰이 없습니다"),
			).toBeVisible();
		});
	});

	test.describe("세션 폐기", () => {
		test.skip("개별 세션 폐기 버튼이 표시되어야 한다", async ({ page }) => {
			// 참고: 세션 데이터가 있어야 확인 가능하므로 skip
			// Given: 세션 데이터가 있는 목록 페이지
			await page.goto("/oidc-sessions");

			// Then: 각 행에 폐기 버튼이 존재
		});

		test.skip("Grant ID 클릭 시 일괄 폐기 모달이 표시되어야 한다", async ({
			page,
		}) => {
			// 참고: 실제 Grant ID가 있는 세션 데이터가 필요하므로 skip

			// Then: 일괄 폐기 확인 모달 표시
			await expect(page.getByText("Grant 일괄 폐기")).toBeVisible();
		});
	});
});
