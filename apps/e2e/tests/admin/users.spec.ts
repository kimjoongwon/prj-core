import { test, expect } from "@playwright/test";

test.describe("이용자 목록 페이지", () => {
	test.describe("페이지 렌더링", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 이용자 목록 페이지 진입
			await page.goto("./users");
			await page.waitForLoadState("networkidle");
		});

		test("페이지 타이틀과 설명이 표시되어야 한다", async ({ page }) => {
			// Then: 타이틀과 설명 확인
			await expect(
				page.getByRole("heading", { name: "이용자 목록" }),
			).toBeVisible();
			await expect(
				page.getByText("시스템에 등록된 이용자를 조회합니다."),
			).toBeVisible();
		});

		test("통계 카드 3개가 표시되어야 한다", async ({ page }) => {
			// Then: 전체/활성/비활성 통계 카드 확인
			await expect(page.getByText("전체 이용자")).toBeVisible();
			await expect(page.getByText("활성 이용자")).toBeVisible();
			await expect(page.getByText("비활성 이용자")).toBeVisible();
		});

		test("DataGrid 컬럼 헤더가 표시되어야 한다", async ({ page }) => {
			// Then: 모든 컬럼 헤더 확인
			await expect(page.getByText("이름")).toBeVisible();
			await expect(page.getByText("이메일")).toBeVisible();
			await expect(page.getByText("전화번호")).toBeVisible();
			await expect(page.getByText("역할")).toBeVisible();
			await expect(page.getByText("상태")).toBeVisible();
			await expect(page.getByText("가입일")).toBeVisible();
		});

		test("검색 입력란이 표시되어야 한다", async ({ page }) => {
			// Then: 검색 placeholder 확인
			await expect(
				page.getByPlaceholder("이름, 이메일, 전화번호로 검색..."),
			).toBeVisible();
		});

		test("총 N건 텍스트가 표시되어야 한다", async ({ page }) => {
			// Then: 총 건수 텍스트 확인
			await expect(page.getByText(/총 \d+건/)).toBeVisible();
		});

		test("시드 데이터의 사용자가 DataGrid에 표시되어야 한다", async ({
			page,
		}) => {
			// Then: 시드 데이터 사용자 이름 확인
			await expect(page.getByText("김민수")).toBeVisible();

			// Then: 시드 데이터 이메일 확인
			await expect(page.getByText("admin@plate.com")).toBeVisible();
		});
	});

	test.describe("검색 기능", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 이용자 목록 페이지 진입
			await page.goto("./users");
			await page.waitForLoadState("networkidle");
		});

		test("검색어 입력 시 URL에 search 파라미터가 추가되어야 한다", async ({
			page,
		}) => {
			// When: 검색어 입력
			await page
				.getByPlaceholder("이름, 이메일, 전화번호로 검색...")
				.fill("김민수");

			// debounce 대기
			await page.waitForTimeout(500);

			// Then: URL에 search 파라미터 반영
			await expect(page).toHaveURL(/search=/);
		});

		test("이름으로 검색 시 해당 사용자만 표시되어야 한다", async ({
			page,
		}) => {
			// When: 이름으로 검색
			await page
				.getByPlaceholder("이름, 이메일, 전화번호로 검색...")
				.fill("김민수");
			await page.waitForTimeout(500);
			await page.waitForLoadState("networkidle");

			// Then: 검색된 사용자만 표시
			await expect(page.getByText("김민수")).toBeVisible();
			await expect(page.getByText("이서연")).not.toBeVisible();
		});

		test("이메일로 검색 시 해당 사용자만 표시되어야 한다", async ({
			page,
		}) => {
			// When: 이메일로 검색
			await page
				.getByPlaceholder("이름, 이메일, 전화번호로 검색...")
				.fill("admin@plate.com");
			await page.waitForTimeout(500);
			await page.waitForLoadState("networkidle");

			// Then: 검색된 사용자 표시
			await expect(page.getByText("admin@plate.com")).toBeVisible();
			await expect(page.getByText("Super Admin")).toBeVisible();
		});

		test("존재하지 않는 검색어 입력 시 빈 상태 메시지가 표시되어야 한다", async ({
			page,
		}) => {
			// When: 존재하지 않는 검색어 입력
			await page
				.getByPlaceholder("이름, 이메일, 전화번호로 검색...")
				.fill("존재하지않는사용자xyz");
			await page.waitForTimeout(500);
			await page.waitForLoadState("networkidle");

			// Then: 빈 상태 메시지 표시
			await expect(
				page.getByText("조회된 이용자가 없습니다."),
			).toBeVisible();
		});

		test("검색어를 지우면 전체 목록으로 복원되어야 한다", async ({
			page,
		}) => {
			// Given: 검색어 입력 상태
			const searchInput = page.getByPlaceholder(
				"이름, 이메일, 전화번호로 검색...",
			);
			await searchInput.fill("김민수");
			await page.waitForTimeout(500);
			await page.waitForLoadState("networkidle");

			// When: 검색어 삭제
			await searchInput.clear();
			await page.waitForTimeout(500);
			await page.waitForLoadState("networkidle");

			// Then: 전체 목록 복원 (여러 사용자가 다시 표시됨)
			await expect(page.getByText("김민수")).toBeVisible();
			await expect(page.getByText("admin@plate.com")).toBeVisible();
		});
	});

	test.describe("URL 상태 관리", () => {
		test("URL 파라미터 search로 페이지 진입 시 검색어가 복원되어야 한다", async ({
			page,
		}) => {
			// Given: search 파라미터가 포함된 URL로 진입
			await page.goto("./users?search=김민수");
			await page.waitForLoadState("networkidle");

			// Then: 검색 입력란에 검색어가 복원됨
			await expect(
				page.getByPlaceholder("이름, 이메일, 전화번호로 검색..."),
			).toHaveValue("김민수");

			// Then: 검색 결과가 필터링되어 표시됨
			await expect(page.getByText("김민수")).toBeVisible();
		});

		test("URL 파라미터 take로 페이지 크기가 설정되어야 한다", async ({
			page,
		}) => {
			// Given: take 파라미터가 포함된 URL로 진입
			await page.goto("./users?take=5");
			await page.waitForLoadState("networkidle");

			// Then: 페이지가 정상 렌더링됨
			await expect(
				page.getByRole("heading", { name: "이용자 목록" }),
			).toBeVisible();
			await expect(page.getByText(/총 \d+건/)).toBeVisible();
		});
	});

	test.describe("데이터 표시", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 이용자 목록 페이지 진입
			await page.goto("./users");
			await page.waitForLoadState("networkidle");
		});

		test("전화번호가 포맷팅되어 표시되어야 한다", async ({ page }) => {
			// Then: 전화번호가 하이픈 형식으로 포맷팅됨 (예: 010-5678-9012)
			await expect(page.getByText("010-5678-9012")).toBeVisible();
		});

		test("활성 사용자의 상태가 활성으로 표시되어야 한다", async ({
			page,
		}) => {
			// Then: 활성 상태 칩이 표시됨
			await expect(page.getByText("활성").first()).toBeVisible();
		});
	});
});
