import { loginToConsole } from "@cocrepo/e2e";
import { expect, test } from "@playwright/test";

test.describe("감사 로그", () => {
	test.describe("목록 페이지", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 로그인 후 감사 로그 페이지 진입
			await loginToConsole(page);
			await page.goto("./settings/auth/audit-logs");
			await page.waitForLoadState("networkidle");
		});

		test("페이지 타이틀이 표시되어야 한다", async ({ page }) => {
			// Then: 페이지 구성 요소 확인
			await expect(page.getByText("로그인 감사 로그")).toBeVisible();
			await expect(
				page.getByText("로그인 시도에 대한 감사 로그를 조회합니다"),
			).toBeVisible();
		});

		test("데이터 그리드 컬럼이 표시되어야 한다", async ({ page }) => {
			// Then: DataGrid 컬럼 헤더 확인
			await expect(page.getByText("시간")).toBeVisible();
			await expect(page.getByText("이메일")).toBeVisible();
			await expect(page.getByText("결과")).toBeVisible();
			await expect(page.getByText("실패 사유")).toBeVisible();
			await expect(page.getByText("IP 주소")).toBeVisible();
		});
	});

	test.describe("이메일 검색", () => {
		test("검색어 입력 시 필터링되어야 한다", async ({ page }) => {
			// Given: 감사 로그 페이지 진입
			await loginToConsole(page);
			await page.goto("./settings/auth/audit-logs");
			await page.waitForLoadState("networkidle");

			// When: 이메일 검색
			const searchInput = page.getByPlaceholder("이메일로 검색...");
			await searchInput.fill("admin@example.com");
			await searchInput.press("Enter");

			// debounce 대기
			await page.waitForTimeout(500);

			// Then: URL 파라미터에 검색어 반영
			await expect(page).toHaveURL(/email=admin/);
		});
	});

	test.describe("결과 뱃지", () => {
		test("로그인 시도 결과 뱃지가 표시되어야 한다", async ({ page }) => {
			// Given: 감사 로그 페이지 진입 (로그인으로 인해 최소 1건의 로그 존재)
			await loginToConsole(page);
			await page.goto("./settings/auth/audit-logs");
			await page.waitForLoadState("networkidle");

			// Then: 로그인 성공 기록이 있으므로 "성공" 뱃지가 표시됨
			await expect(page.getByText("성공").first()).toBeVisible();
		});
	});
});
