import { test, expect } from "@playwright/test";

test.describe("Subject 목록 페이지", () => {
	// ── 목록 페이지 렌더링 ──

	test.describe("목록 페이지 렌더링", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("./subjects");
			await page.waitForLoadState("networkidle");
		});

		test("페이지 타이틀이 표시되어야 한다", async ({ page }) => {
			// Then: 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "Subject 목록" }),
			).toBeVisible();
		});

		test("시드 데이터의 Subject가 표시되어야 한다", async ({ page }) => {
			// Then: entity 그룹 Subject 확인 (grid rowheader로 매칭)
			const grid = page.getByRole("grid");
			await expect(
				grid.getByRole("rowheader", { name: "entity:User" }),
			).toBeVisible();

			// Then: menu 그룹 Subject 확인
			await expect(
				grid.getByRole("rowheader", { name: "menu:dashboard" }),
			).toBeVisible();
		});

		test("DataGrid 컬럼 헤더가 표시되어야 한다", async ({ page }) => {
			// Then: 컬럼 헤더 확인
			await expect(
				page.getByRole("columnheader", { name: "식별자" }),
			).toBeVisible();
			await expect(
				page.getByRole("columnheader", { name: "표시명" }),
			).toBeVisible();
			await expect(
				page.getByRole("columnheader", { name: "분류" }),
			).toBeVisible();
		});

		test("그룹별 Chip이 표시되어야 한다", async ({ page }) => {
			// Then: entity, menu 그룹 Chip (gridcell 내 Chip 텍스트)
			const grid = page.getByRole("grid");
			await expect(
				grid.getByRole("gridcell", { name: "entity" }).first(),
			).toBeVisible();
			await expect(
				grid.getByRole("gridcell", { name: "menu" }).first(),
			).toBeVisible();
		});
	});

	// ── Subject 그룹 필터링 ──

	test.describe("그룹 필터링", () => {
		test("분류 필터 버튼이 존재해야 한다", async ({ page }) => {
			// Given: Subject 목록 페이지
			await page.goto("./subjects");
			await page.waitForLoadState("networkidle");

			// Then: 분류 필터 버튼 확인
			await expect(
				page.getByRole("button", { name: /분류/ }),
			).toBeVisible();
		});
	});
});
