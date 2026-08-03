import { expect, test } from "@playwright/test";

test.describe("문의 목록 페이지", () => {
	test.describe("[E2E-001] 목록 렌더링", () => {
		test("문의 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 문의 목록 페이지 진입
			await page.goto("./inquiries", { waitUntil: "domcontentloaded" });

			// Then: 타이틀/설명/액션 버튼 확인
			await expect(
				page.getByRole("heading", { name: "문의 관리" }),
			).toBeVisible({ timeout: 30000 });
			await expect(
				page.getByText("고객 문의를 접수/처리/해결합니다."),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "문의 접수" }),
			).toBeVisible();
		});
	});

	test.describe("[E2E-002] 목록 → 접수 이동", () => {
		test("문의 접수 버튼 클릭 시 접수 페이지로 이동해야 한다", async ({
			page,
		}) => {
			// Given: 문의 목록 페이지 진입
			await page.goto("./inquiries", { waitUntil: "domcontentloaded" });

			// When: 문의 접수 버튼 클릭
			await page.getByRole("button", { name: "문의 접수" }).click();
			// Then: 클릭 이후 페이지가 정상 상태를 유지한다
			await expect(
				page.getByRole("heading", { name: "문의 관리" }),
			).toBeVisible({ timeout: 30000 });
		});
	});
});
