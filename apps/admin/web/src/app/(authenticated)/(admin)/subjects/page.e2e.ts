import { expect, test } from "@playwright/test";

test.describe("권한 대상 목록 페이지", () => {
	// ── 목록 페이지 렌더링 ──

	test.describe("목록 페이지 렌더링", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("./subjects");
			await page.waitForLoadState("networkidle");
		});

		test("페이지 타이틀이 표시되어야 한다", async ({ page }) => {
			// Then: 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "권한 대상 목록" }),
			).toBeVisible();
		});

		test("시드 데이터의 대상이 표시되어야 한다", async ({ page }) => {
			// Then: 데이터 대상 확인 (grid rowheader로 매칭)
			const table = page.getByRole("table", { name: "데이터 테이블" });
			await expect(table.getByRole("row").nth(1)).toBeVisible();
		});

		test("DataGrid 컬럼 헤더가 표시되어야 한다", async ({ page }) => {
			// Then: 컬럼 헤더 확인
			await expect(
				page.getByRole("columnheader", { name: "대상" }),
			).toBeVisible();
			await expect(
				page.getByRole("columnheader", { name: "유형" }),
			).toBeVisible();
			await expect(
				page.getByRole("columnheader", { name: "설명" }),
			).toBeVisible();
		});

		test("유형별 Chip이 표시되어야 한다", async ({ page }) => {
			// Then: 데이터, 메뉴 유형 Chip (gridcell 내 Chip 텍스트)
			const table = page.getByRole("table", { name: "데이터 테이블" });
			await expect(
				table.getByRole("cell", { name: "데이터" }).first(),
			).toBeVisible();
			await expect(
				table.getByRole("cell", { name: "메뉴" }).first(),
			).toBeVisible();
			await expect(
				table.getByText("데이터에 대한 조회, 생성, 수정").first(),
			).toBeVisible();
		});

		test("대상 행 클릭 시 상세 페이지로 이동해야 한다", async ({ page }) => {
			// When: 대상 셀 클릭
			const table = page.getByRole("table", { name: "데이터 테이블" });
			await table.getByRole("row").nth(1).click();

			// Then: 상세 페이지 진입 확인
			await expect(page).toHaveURL(/\/subjects\/[1-9]\d*$/);
			await expect(
				page.getByRole("heading", { name: "Subject 상세" }),
			).toBeVisible();
		});
	});

	// ── 권한 대상 유형 필터링 ──

	test.describe("유형 필터링", () => {
		test("대상 유형 필터가 존재해야 한다", async ({ page }) => {
			// Given: Subject 목록 페이지
			await page.goto("./subjects");
			await page.waitForLoadState("networkidle");

			// Then: 대상 유형 필터 확인
			await expect(page.getByRole("tab", { name: "메뉴" })).toBeVisible();
			await expect(page.getByText("권한 대상입니다.").first()).toBeVisible();
		});

		test("대상 유형 필터로 메뉴 대상만 조회할 수 있어야 한다", async ({
			page,
		}) => {
			// Given: Subject 목록 페이지
			await page.goto("./subjects");
			await page.waitForLoadState("networkidle");

			// When: 메뉴 유형 선택
			await page.getByRole("tab", { name: "메뉴" }).click();

			// Then: 메뉴 대상만 표시
			const table = page.getByRole("table", { name: "데이터 테이블" });
			await expect(page).toHaveURL(/group=menu/);
			await expect(table.getByRole("row").nth(1)).toBeVisible();
			await expect(table.getByRole("cell", { name: "데이터" })).toHaveCount(0);
		});
	});
});
