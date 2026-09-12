import { expect, test } from "@playwright/test";

test.describe("문의 상세 페이지", () => {
	test.describe("[E2E-001] 상세 렌더링", () => {
		test("문의 상세 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			const inquiriesResponse = await page.request.get(
				"http://localhost:3000/api/v1/inquiries?skip=0&take=1",
			);
			test.skip(
				inquiriesResponse.status() !== 200,
				`문의 조회 API 응답이 200이 아닙니다. status=${inquiriesResponse.status()}`,
			);

			const inquiriesBody = (await inquiriesResponse.json()) as {
				data?: Array<{ id?: string }>;
			};
			const inquiryId = inquiriesBody.data?.[0]?.id;
			test.skip(
				!inquiryId,
				"조회 가능한 문의 데이터가 없어 상세 페이지를 검증할 수 없습니다.",
			);

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
