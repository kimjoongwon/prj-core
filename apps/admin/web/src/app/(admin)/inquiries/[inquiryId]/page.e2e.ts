import { expect, test } from "@playwright/test";

test.describe("문의 상세 페이지", () => {
	test.describe("[E2E-001] 상세 렌더링", () => {
		test("문의 상세 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			const inquiryId = "e2e-inquiry-detail";

			// Given: 문의 상세 페이지 직접 진입
			await page.goto(`./inquiries/${inquiryId}`, {
				waitUntil: "domcontentloaded",
			});

			// Then: 핵심 UI 확인
			await expect(
				page.getByRole("heading", { name: "문의 상세" }),
			).toBeVisible();
			await expect(
				page.getByText("문의 상세 정보를 확인하고 답변을 작성합니다."),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "목록으로" }),
			).toBeVisible();
			await expect(page.getByRole("button", { name: "수정" })).toBeVisible();
			await expect(page.getByRole("button", { name: "삭제" })).toBeVisible();
		});
	});
});
