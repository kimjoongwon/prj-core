import { expect, test } from "@playwright/test";

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
				page.getByRole("heading", { name: "권한 액션 목록" }),
			).toBeVisible();
		});

		test("권한 액션의 맥락 안내가 표시되어야 한다", async ({ page }) => {
			await expect(
				page.getByRole("heading", { name: "권한 액션 카탈로그" }),
			).toBeVisible();
			await expect(
				page.getByText("액션은 역할과 정책에서 허용할 동작 단위입니다."),
			).toBeVisible();
			await expect(
				page.getByText("Ability = 대상 + 액션", { exact: false }),
			).toBeVisible();
			await expect(
				page.getByText("시스템 액션은 기본 제공 항목", { exact: false }),
			).toBeVisible();
		});

		test("시드 데이터의 Action이 표시되어야 한다", async ({ page }) => {
			// Then: 시스템 기본 Action 확인 (rowheader로 정확한 식별자 매칭)
			const grid = page.getByRole("grid");
			await expect(
				grid.getByRole("gridcell", { name: "create", exact: true }),
			).toBeVisible();
			await expect(
				grid.getByRole("gridcell", { name: "read", exact: true }),
			).toBeVisible();
			await expect(
				grid.getByRole("gridcell", { name: "update", exact: true }),
			).toBeVisible();
			await expect(
				grid.getByRole("gridcell", { name: "delete", exact: true }),
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
			await expect(
				page.getByRole("columnheader", { name: "순서" }),
			).toHaveCount(0);
		});

		test("그룹별 Chip이 이해 가능한 라벨로 표시되어야 한다", async ({
			page,
		}) => {
			const grid = page.getByRole("grid");
			await expect(
				grid.getByRole("gridcell", { name: "CRUD" }).first(),
			).toBeVisible();
			await expect(
				grid.getByRole("gridcell", { name: "표시/마스킹" }).first(),
			).toBeVisible();
			await expect(
				grid.getByRole("gridcell", { name: "워크플로우" }).first(),
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

			// Then: 현재 시드 데이터 기준으로 시스템 컬럼에 "시스템" 값이 표시됨
			const grid = page.getByRole("grid");
			await expect(
				grid.getByRole("gridcell", { name: "시스템" }).first(),
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
				page.getByRole("textbox", { name: "액션명 또는 표시명 검색" }),
			).toBeVisible();
		});

		test("액션 등록 버튼이 존재해야 한다", async ({ page }) => {
			// Given: Action 목록 페이지
			await page.goto("./actions");
			await page.waitForLoadState("networkidle");

			// Then: 등록 버튼 확인
			await expect(
				page.getByRole("button", { name: "액션 등록" }),
			).toBeVisible();
		});

		test("검색어로 액션 목록을 좁혀볼 수 있어야 한다", async ({ page }) => {
			await page.goto("./actions");
			await page.waitForLoadState("networkidle");

			const searchInput = page.getByRole("textbox", {
				name: "액션명 또는 표시명 검색",
			});
			await searchInput.fill("마스킹");
			await searchInput.press("Enter");

			const grid = page.getByRole("grid");
			await expect(
				grid.getByRole("gridcell", { name: "read:masked:email" }),
			).toBeVisible();
			await expect(
				grid.getByRole("gridcell", { name: "create", exact: true }),
			).toHaveCount(0);
		});
	});

	// ── 그룹 필터와 상세 진입 ──

	test.describe("그룹 필터와 상세 진입", () => {
		test("그룹 탭으로 워크플로우 액션만 볼 수 있어야 한다", async ({
			page,
		}) => {
			await page.goto("./actions");
			await page.waitForLoadState("networkidle");

			await page.getByRole("tab", { name: "워크플로우" }).click();

			const grid = page.getByRole("grid");
			await expect(
				grid.getByRole("gridcell", { name: "approve", exact: true }),
			).toBeVisible();
			await expect(
				grid.getByRole("gridcell", { name: "create", exact: true }),
			).toHaveCount(0);
		});

		test("상세 버튼으로 액션 상세 화면에 진입할 수 있어야 한다", async ({
			page,
		}) => {
			await page.goto("./actions");
			await page.waitForLoadState("networkidle");

			const grid = page.getByRole("grid");
			const createRow = grid.getByRole("row", { name: /create 생성 CRUD/ });
			await expect(createRow).toBeVisible();
			await Promise.all([
				page.waitForURL(/\/admin\/actions\/[^/]+$/, { timeout: 30000 }),
				createRow.getByRole("button", { name: "상세" }).click(),
			]);
		});
	});

	// ── Action 등록 페이지 ──

	test.describe("Action 등록 페이지", () => {
		test("Action 등록 페이지에서 폼이 렌더링되어야 한다", async ({ page }) => {
			// Given: Action 등록 페이지
			await page.goto("./actions/new");
			await page.waitForLoadState("networkidle");

			// Then: 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "Action 등록" }),
			).toBeVisible();

			// Then: 폼 필드 확인
			await expect(
				page.getByRole("textbox", { name: /행위 식별자/ }),
			).toBeVisible();
			await expect(page.getByRole("textbox", { name: "표시명" })).toBeVisible();
		});
	});
});
