import { test, expect } from "@playwright/test";

test.describe("권한 등록 페이지", () => {
	// ── E2E-003: 등록 폼 ──

	test.describe("[E2E-003] 등록 폼", () => {
		test("권한 등록 페이지에서 폼이 렌더링되어야 한다", async ({ page }) => {
			// Given: 권한 등록 페이지 진입
			await page.goto("./abilities/new");
			await page.waitForLoadState("networkidle");

			// Then: 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "권한 등록" }),
			).toBeVisible();

			// Then: CASL 정보 섹션의 Subject/Action 드롭다운 확인
			await expect(
				page.getByRole("button", { name: /Subject/ }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: /Action/ }),
			).toBeVisible();
		});
	});
});
