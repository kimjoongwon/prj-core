import { expect, test } from "@playwright/test";

function buildUniqueTemplateCode() {
	return `E2E_TOGGLE_TEMPLATE_${Date.now()}`;
}

const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";
const SPACE_HEADERS = { "x-space-id": SYSTEM_SPACE_ID };

test.describe("메시지 템플릿 상세 페이지", () => {
	// ── E2E-001: 활성 상태 토글 ──

	test.describe("[E2E-001] 활성 상태 토글", () => {
		test("템플릿 상세에서 활성 상태 토글이 동작해야 한다", async ({ page }) => {
			const TEST_CODE = buildUniqueTemplateCode();

			// Given: SMS 템플릿 API로 직접 생성
			const createResp = await page.request.post(
				"http://localhost:3000/api/v1/templates",
				{
					headers: SPACE_HEADERS,
					data: {
						type: "SMS",
						code: TEST_CODE,
						name: "E2E 토글 테스트 템플릿",
						subject: null,
						content: "토글 테스트 본문입니다.",
						description: null,
					},
				},
			);
			expect(createResp.status()).toBe(201);
			const created = await createResp.json();
			const templateId = created.data?.id;
			expect(templateId).toBeTruthy();

			// Given: 상세 페이지 진입
			await page.goto(`./templates/${templateId}`);
			await page.waitForLoadState("networkidle");

			// Then: 현재 활성 상태 (기본값 true) 확인
			const toggle = page.getByRole("switch", { name: /활성|비활성/ });
			await expect(toggle).toBeVisible();

			// When: 토글 클릭 (PATCH 응답 대기)
			const toggleResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/toggle-status") &&
					resp.request().method() === "PATCH",
			);
			await toggle.click();
			const toggleResp = await toggleResponse;

			// Then: 200 OK 응답 확인
			expect(toggleResp.status()).toBe(200);

			// Cleanup: 템플릿 삭제
			await page.request.delete(
				`http://localhost:3000/api/v1/templates/${templateId}`,
				{ headers: SPACE_HEADERS },
			);
		});
	});
});
