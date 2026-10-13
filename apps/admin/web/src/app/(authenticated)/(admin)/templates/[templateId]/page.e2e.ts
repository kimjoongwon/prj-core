import { getAdminSpaceRequestHeaders, loginToConsole } from "@cocrepo/e2e";
import { expect, test } from "@playwright/test";

function buildUniqueTemplateCode() {
	return `E2E_TOGGLE_TEMPLATE_${Date.now()}`;
}

let ADMIN_TENANT_ID = "";

test.beforeEach(async ({ page }) => {
	const context = await loginToConsole(page);
	ADMIN_TENANT_ID = context.tenantId;
});

const getSpaceHeaders = () => getAdminSpaceRequestHeaders(ADMIN_TENANT_ID);

const ADMIN_API_BASE_URL = new URL(
	"/api/v1",
	process.env.E2E_CORE_API_BASE_URL ?? "http://localhost:3000/",
).toString();

test.describe("메시지 템플릿 상세 페이지", () => {
	// ── E2E-001: 활성 상태 토글 ──

	test.describe("[E2E-001] 활성 상태 토글", () => {
		test("템플릿 상세에서 활성 상태 토글이 동작해야 한다", async ({ page }) => {
			const TEST_CODE = buildUniqueTemplateCode();

			// Given: SMS 템플릿 API로 직접 생성
			const createResp = await page.request.post(
				`${ADMIN_API_BASE_URL}/templates`,
				{
					headers: getSpaceHeaders(),
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
			expect(templateId).toMatch(/^[1-9]\d*$/);

			// Given: 상세 페이지 진입
			await page.goto(`./templates/${templateId}`);
			await page.waitForLoadState("networkidle");

			// Then: 현재 활성 상태 (기본값 true)가 상태 Chip으로 표시되는지 확인
			// 상세 페이지의 상태 정보 영역은 활성 상태를 Chip(활성/비활성)으로
			// 보여주고 토글은 "상태 변경" 버튼이 담당한다(8f508f6e7 Chip 체계).
			const activeStatusChip = page.getByText("활성", { exact: true });
			await expect(activeStatusChip).toBeVisible();

			// When: 상태 변경 버튼 클릭 (PATCH 응답 대기)
			const toggleButton = page.getByRole("button", {
				name: "상태 변경",
				exact: true,
			});
			const toggleResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/toggle-status") &&
					resp.request().method() === "PATCH",
			);
			await toggleButton.click();
			const toggleResp = await toggleResponse;

			// Then: 200 OK 응답 확인
			expect(toggleResp.status()).toBe(200);

			// And: 무효화된 상세 조회가 재수행되어 Chip이 비활성으로 전환된다
			await expect(page.getByText("비활성", { exact: true })).toBeVisible();

			// Cleanup: 템플릿 삭제
			await page.request.delete(
				`${ADMIN_API_BASE_URL}/templates/${templateId}`,
				{ headers: getSpaceHeaders() },
			);
		});
	});
});
