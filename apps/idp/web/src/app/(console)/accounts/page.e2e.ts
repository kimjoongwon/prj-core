import { expect, test } from "@playwright/test";
import { loginToConsole } from "@cocrepo/ui/e2e";

test.describe("IDP 계정 목록 페이지", () => {
	test.describe("목록 페이지", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 로그인 후 계정 관리 페이지 진입
			await loginToConsole(page);
			await page.goto("/accounts");
			await page.waitForLoadState("networkidle");
		});

		test("페이지 타이틀이 표시되어야 한다", async ({ page }) => {
			// Then: 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "계정 관리" }),
			).toBeVisible();
			await expect(
				page.getByText("IDP 계정의 보안 상태를 관리합니다"),
			).toBeVisible();
		});

		test("데이터 그리드 컬럼이 표시되어야 한다", async ({ page }) => {
			// Then: DataGrid 컬럼 헤더 확인
			await expect(page.getByText("이름")).toBeVisible();
			await expect(page.getByText("이메일")).toBeVisible();
			await expect(page.getByText("활성 상태")).toBeVisible();
			await expect(page.getByText("잠금 상태")).toBeVisible();
			await expect(page.getByText("실패 횟수")).toBeVisible();
			await expect(page.getByText("최종 로그인")).toBeVisible();
		});

		test("계정 데이터가 표시되어야 한다", async ({ page }) => {
			// Then: 시드 데이터의 admin 계정이 표시됨
			await expect(page.getByText("admin@plate.com")).toBeVisible();
		});
	});

	test.describe("검색", () => {
		test("검색어 입력 시 필터링되어야 한다", async ({ page }) => {
			// Given: 계정 관리 페이지 진입
			await loginToConsole(page);
			await page.goto("/accounts");
			await page.waitForLoadState("networkidle");

			// When: 이메일 검색
			await page.getByPlaceholder("이메일 또는 이름으로 검색...").fill("admin");

			// debounce 대기
			await page.waitForTimeout(500);

			// Then: URL 파라미터에 검색어 반영
			await expect(page).toHaveURL(/search=admin/);
		});
	});
});
