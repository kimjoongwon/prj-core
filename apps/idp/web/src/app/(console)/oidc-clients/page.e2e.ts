import { expect, test } from "@playwright/test";
import { loginToConsole } from "@cocrepo/e2e";

test.describe("OIDC 클라이언트 목록 페이지", () => {
	test.beforeEach(async ({ page }) => {
		// Given: 로그인 후 콘솔 진입
		await loginToConsole(page);
		await page.goto("/oidc-clients");
		await page.waitForLoadState("networkidle");
	});

	test("페이지 타이틀과 등록 버튼이 표시되어야 한다", async ({ page }) => {
		// Then: 페이지 구성 요소 확인
		await expect(
			page.getByRole("heading", { name: "OIDC 클라이언트" }),
		).toBeVisible();
		await expect(
			page.getByText("시스템에 등록된 OIDC 클라이언트를 관리합니다"),
		).toBeVisible();
		await expect(page.getByText("클라이언트 등록")).toBeVisible();
	});

	test("데이터 그리드가 렌더링되어야 한다", async ({ page }) => {
		// Then: DataGrid 컬럼 헤더 확인
		await expect(page.getByText("Client ID")).toBeVisible();
		await expect(page.getByText("이름")).toBeVisible();
		await expect(page.getByText("인증 방식")).toBeVisible();
		await expect(page.getByText("Grant Types")).toBeVisible();
	});

	test("검색어 입력 시 필터링되어야 한다", async ({ page }) => {
		// When: 검색어 입력
		await page
			.getByPlaceholder("Client ID 또는 이름으로 검색...")
			.fill("admin");

		// debounce 대기
		await page.waitForTimeout(500);

		// Then: URL 파라미터에 검색어 반영
		await expect(page).toHaveURL(/search=admin/);
	});
});

test.describe("OIDC 클라이언트 등록 페이지", () => {
	test("등록 폼이 렌더링되어야 한다", async ({ page }) => {
		// Given: 로그인 후 등록 페이지 진입
		await loginToConsole(page);
		await page.goto("/oidc-clients/new");
		await page.waitForLoadState("networkidle");

		// Then: 등록 페이지 확인
		await expect(page.getByText("클라이언트 등록")).toBeVisible();
	});
});
