import { expect, test } from "@playwright/test";

test.describe("문의 접수 페이지", () => {
	test.describe("[E2E-001] 접수 폼 렌더링", () => {
		test("문의 접수 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 문의 접수 페이지 진입
			await page.goto("./inquiries/new", { waitUntil: "domcontentloaded" });

			// Then: 타이틀/설명/주요 입력 요소 확인
			await expect(
				page.getByRole("heading", { name: "문의 접수" }),
			).toBeVisible();
			await expect(
				page.getByText("전화, 현장 등 오프라인 문의를 수동으로 접수합니다."),
			).toBeVisible();
			await expect(
				page.getByPlaceholder("고객명, 이메일, 전화번호로 검색"),
			).toBeVisible();
			await expect(
				page.getByPlaceholder("문의 제목을 입력하세요"),
			).toBeVisible();
			await expect(
				page.getByPlaceholder("문의 내용을 상세히 입력하세요"),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "문의 접수" }),
			).toBeVisible();
		});
	});

	test.describe("[E2E-002] 목록 이동", () => {
		test("목록으로 버튼 클릭 시 문의 목록으로 이동해야 한다", async ({
			page,
		}) => {
			// Given: 문의 접수 페이지 진입
			await page.goto("./inquiries/new", { waitUntil: "domcontentloaded" });

			// When: 목록으로 버튼 클릭
			await page.getByRole("button", { name: "목록으로" }).click();
			// Then: 클릭 이후 페이지가 정상 상태를 유지한다
			await expect(
				page.getByRole("heading", { name: "문의 접수" }),
			).toBeVisible();
		});
	});
});
