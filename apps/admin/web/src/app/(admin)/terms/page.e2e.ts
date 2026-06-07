import { mockAdminShell } from "@cocrepo/e2e";
import { expect, type Page, test } from "@playwright/test";

const serviceDocumentListResponse = {
	httpStatus: 200,
	message: "OK",
	data: [
		{
			id: "e2e-service-document-1",
			createdAt: "2026-05-02T00:00:00.000Z",
			updatedAt: "2026-05-02T00:00:00.000Z",
			removedAt: null,
			kind: "MARKETING_CONSENT",
			platform: "MOBILE",
			locale: "ko-KR",
			title: "마케팅 정보 수신 동의",
			summary: "모바일 서비스 마케팅 수신 동의",
			content: "마케팅 정보 수신에 동의합니다.",
			format: "MARKDOWN",
			version: "2026.05.02",
			status: "PUBLISHED",
			isRequired: false,
			displayOrder: 30,
			effectiveAt: "2026-05-02T00:00:00.000Z",
			publishedAt: "2026-05-02T00:00:00.000Z",
		},
	],
	meta: {
		total: 1,
		page: 1,
		limit: 20,
		totalPages: 1,
	},
};

async function fulfillServiceDocumentList(page: Page) {
	await page.route("**/api/v1/service-documents**", async (route) => {
		const request = route.request();
		const url = new URL(request.url());

		if (
			request.method() === "GET" &&
			url.pathname.includes("/api/v1/service-documents")
		) {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify(serviceDocumentListResponse),
			});
			return;
		}

		await route.fallback();
	});
}

test.describe("약관 관리 페이지 @mock", () => {
	test("[E2E-001] 목록과 초안 작성 패널이 렌더링되어야 한다", async ({
		page,
	}) => {
		await mockAdminShell(page);
		await fulfillServiceDocumentList(page);

		await page.goto("./terms");
		await page.waitForLoadState("networkidle");

		await expect(
			page.getByRole("heading", { name: "약관 관리" }),
		).toBeVisible();
		await expect(page.getByRole("button", { name: "문서 등록" })).toBeVisible();
		await expect(page.getByText("문서 목록", { exact: true })).toBeVisible();
		await expect(page.getByRole("button", { name: "초안 저장" })).toBeVisible();
	});

	test("[E2E-002] 필수 입력 누락 시 생성 API를 호출하지 않아야 한다", async ({
		page,
	}) => {
		let createCalled = false;

		await mockAdminShell(page);
		await fulfillServiceDocumentList(page);
		await page.route("**/api/v1/service-documents", async (route) => {
			if (route.request().method() === "POST") {
				createCalled = true;
			}
			await route.fallback();
		});

		await page.goto("./terms");
		await page.waitForLoadState("networkidle");
		await page.getByRole("button", { name: "초안 저장" }).click();

		expect(createCalled).toBe(false);
		await expect(page.getByText("입력 확인")).toBeVisible();
	});
});
