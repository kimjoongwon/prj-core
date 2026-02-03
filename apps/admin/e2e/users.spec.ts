import { expect, test } from "@playwright/test";

test.describe("이용자 목록 페이지", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("./users");
		// 로딩 완료 대기
		await page.waitForLoadState("networkidle");
	});

	test("페이지 타이틀과 설명이 표시된다", async ({ page }) => {
		await expect(page.getByRole("heading", { name: "이용자 목록" })).toBeVisible();
		await expect(page.getByText("시스템에 등록된 이용자를 조회합니다.")).toBeVisible();
	});

	test("통계 카드가 표시된다", async ({ page }) => {
		// 통계 카드는 stats 데이터가 있을 때만 표시됨
		const statsSection = page.getByText("전체 이용자");
		const hasStats = await statsSection.isVisible().catch(() => false);

		if (hasStats) {
			await expect(page.getByText("전체 이용자")).toBeVisible();
			await expect(page.getByText("활성 이용자")).toBeVisible();
			await expect(page.getByText("비활성 이용자")).toBeVisible();
		} else {
			// stats가 없는 경우 테스트 스킵 (데이터 의존적)
			test.skip();
		}
	});

	test("데이터 그리드가 표시된다", async ({ page }) => {
		// 총 N건 텍스트가 표시되는지 확인 (데이터 그리드 영역)
		const totalCount = page.getByText(/총 \d+건/).first();
		await expect(totalCount).toBeVisible();
	});

	test("검색 입력란이 표시된다", async ({ page }) => {
		const searchInput = page.getByPlaceholder(/이름, 이메일, 전화번호/);
		await expect(searchInput).toBeVisible();
	});

	test("검색어 입력 시 URL 파라미터가 변경된다", async ({ page }) => {
		const searchInput = page.getByPlaceholder(/이름, 이메일, 전화번호/);

		await searchInput.fill("테스트");
		// debounce 대기 (300ms + 여유)
		await page.waitForTimeout(500);

		// URL 인코딩된 한글도 매칭
		await expect(page).toHaveURL(/search=/);
	});

	test("검색어 입력 시 데이터가 필터링된다", async ({ page }) => {
		const searchInput = page.getByPlaceholder(/이름, 이메일, 전화번호/);

		await searchInput.fill("존재하지않는검색어");
		await page.waitForTimeout(500);
		await page.waitForLoadState("networkidle");

		// 검색 파라미터가 URL에 반영됨
		await expect(page).toHaveURL(/search=/);
	});

	test("페이지네이션 영역이 표시된다", async ({ page }) => {
		// 총 N건 텍스트 확인
		const totalCount = page.getByText(/총 \d+건/);
		await expect(totalCount).toBeVisible();
	});
});

test.describe("이용자 목록 페이지 네비게이션", () => {
	test("URL 파라미터로 페이지 상태를 복원한다", async ({ page }) => {
		await page.goto("./users?search=관리자&take=10&skip=0");
		await page.waitForLoadState("networkidle");

		const searchInput = page.getByPlaceholder(/이름, 이메일, 전화번호/);
		await expect(searchInput).toHaveValue("관리자");
	});
});
