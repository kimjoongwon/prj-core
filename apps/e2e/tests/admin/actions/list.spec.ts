import { test, expect } from "@playwright/test";

test.describe("Action 목록 페이지", () => {
	// ── 목록 페이지 렌더링 ──

	test.describe("목록 페이지 렌더링", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("./actions");
			await page.waitForLoadState("networkidle");
		});

		test("페이지 타이틀이 표시되어야 한다", async ({ page }) => {
			// Then: 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "Action 목록" }),
			).toBeVisible();
		});

		test("시드 데이터의 Action이 표시되어야 한다", async ({ page }) => {
			// Then: 시스템 기본 Action 확인 (rowheader로 정확한 식별자 매칭)
			const grid = page.getByRole("grid");
			await expect(
				grid.getByRole("rowheader", { name: "create", exact: true }),
			).toBeVisible();
			await expect(
				grid.getByRole("rowheader", { name: "read", exact: true }),
			).toBeVisible();
			await expect(
				grid.getByRole("rowheader", { name: "update", exact: true }),
			).toBeVisible();
			await expect(
				grid.getByRole("rowheader", { name: "delete", exact: true }),
			).toBeVisible();
		});

		test("DataGrid 컬럼 헤더가 표시되어야 한다", async ({ page }) => {
			// Then: 컬럼 헤더 확인
			await expect(
				page.getByRole("columnheader", { name: "행위 식별자" }),
			).toBeVisible();
			await expect(
				page.getByRole("columnheader", { name: "표시명" }),
			).toBeVisible();
			await expect(
				page.getByRole("columnheader", { name: "분류" }),
			).toBeVisible();
		});

		test("그룹별 Chip이 올바르게 표시되어야 한다", async ({ page }) => {
			// Then: crud 그룹 Chip 표시
			const grid = page.getByRole("grid");
			await expect(
				grid.getByRole("gridcell", { name: "crud" }).first(),
			).toBeVisible();

			// Then: visibility 그룹 Chip 표시
			await expect(
				grid.getByRole("gridcell", { name: "visibility" }).first(),
			).toBeVisible();

			// Then: workflow 그룹 Chip 표시
			await expect(
				grid.getByRole("gridcell", { name: "workflow" }).first(),
			).toBeVisible();
		});
	});

	// ── 시스템 컬럼 표시 ──

	test.describe("시스템 컬럼", () => {
		test("시스템 컬럼 헤더가 표시되어야 한다", async ({ page }) => {
			// Given: Action 목록 페이지
			await page.goto("./actions");
			await page.waitForLoadState("networkidle");

			// Then: 시스템 컬럼 헤더 확인
			await expect(
				page.getByRole("columnheader", { name: "시스템" }),
			).toBeVisible();
		});

		test("Action의 시스템 여부가 표시되어야 한다", async ({ page }) => {
			// Given: Action 목록 페이지
			await page.goto("./actions");
			await page.waitForLoadState("networkidle");

			// Then: 시스템 컬럼에 "사용자" 값이 표시됨
			const grid = page.getByRole("grid");
			await expect(
				grid.getByRole("gridcell", { name: "사용자" }).first(),
			).toBeVisible();
		});
	});

	// ── 검색 기능 ──

	test.describe("검색 기능", () => {
		test("검색 기능이 존재해야 한다", async ({ page }) => {
			// Given: Action 목록 페이지
			await page.goto("./actions");
			await page.waitForLoadState("networkidle");

			// Then: 검색 입력란 확인
			await expect(
				page.getByRole("textbox", { name: "이름으로 검색..." }),
			).toBeVisible();
		});

		test("등록 버튼이 존재해야 한다", async ({ page }) => {
			// Given: Action 목록 페이지
			await page.goto("./actions");
			await page.waitForLoadState("networkidle");

			// Then: 등록 버튼 확인
			await expect(
				page.getByRole("button", { name: "등록" }),
			).toBeVisible();
		});
	});
});
