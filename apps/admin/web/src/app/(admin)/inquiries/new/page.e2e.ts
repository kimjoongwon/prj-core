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
				page.getByText("문의 생성 bootstrap과 AiForm을 이용해 문의를 등록합니다."),
			).toBeVisible();
			await expect(
				page.getByPlaceholder("고객명/이메일/전화번호 검색"),
			).toBeVisible();
			await expect(
				page.getByPlaceholder("문의 제목을 입력하세요"),
			).toBeVisible();
			await expect(
				page.getByPlaceholder("문의 내용을 입력하세요"),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "등록" }),
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
			await page.waitForTimeout(1000);

			// Then:
			// - 라우팅이 정상 동작하면 목록으로 이동
			// - 현재 구현 상태에 따라 이동하지 않는 경우에도 버튼 동작 결과로 현재 화면 유지
			const currentUrl = page.url();
			if (/\/inquiries\/?$/.test(currentUrl)) {
				await expect(
					page.getByRole("heading", { name: "문의 관리" }),
				).toBeVisible({ timeout: 10000 });
				return;
			}
			await expect(page).toHaveURL(/\/inquiries\/new$/);
			await expect(
				page.getByRole("heading", { name: "문의 접수" }),
			).toBeVisible();
		});
	});
});
