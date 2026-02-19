import { test, expect } from "@playwright/test";

test.describe("메시지 템플릿 목록 페이지", () => {
	// ── E2E-001: 목록 렌더링 ──

	test.describe("[E2E-001] 목록 렌더링", () => {
		test("템플릿 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 템플릿 목록 페이지 진입
			await page.goto("./templates");
			await page.waitForLoadState("networkidle");

			// Then: 타이틀과 설명 확인
			await expect(
				page.getByRole("heading", { name: "메시지 템플릿" }),
			).toBeVisible();
			await expect(
				page.getByText("시스템에 등록된 메시지 템플릿을 관리합니다."),
			).toBeVisible();
		});

		test("템플릿 등록 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 템플릿 목록 페이지 진입
			await page.goto("./templates");
			await page.waitForLoadState("networkidle");

			// Then: 템플릿 등록 버튼 확인
			await expect(
				page.getByRole("button", { name: "템플릿 등록" }),
			).toBeVisible();
		});

		test("검색 입력 필드가 표시되어야 한다", async ({ page }) => {
			// Given: 템플릿 목록 페이지 진입
			await page.goto("./templates");
			await page.waitForLoadState("networkidle");

			// Then: 검색 필드 확인
			await expect(
				page.getByPlaceholder("이름, 코드로 검색..."),
			).toBeVisible();
		});
	});
});
