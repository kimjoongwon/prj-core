import { loginToConsole } from "@cocrepo/e2e";
import { expect, type Page, test } from "@playwright/test";

test.describe("IDP 접근 신청 생성 페이지", () => {
	test.beforeEach(async ({ page }) => {
		await mockCreateForm(page);
		await mockMyTenantAccessRequests(page);
		await loginToConsole(page);
	});

	test("신청 폼이 렌더링되어야 한다", async ({ page }) => {
		await page.goto("/tenant-access-requests/new");
		await page.waitForLoadState("networkidle");

		await expect(
			page.getByRole("heading", { name: "접근 신청", exact: true }),
		).toBeVisible();
		await expect(page.getByText("신청 정보")).toBeVisible();
		await expect(page.getByText("Space", { exact: true })).toBeVisible();
		await expect(page.getByText("희망 역할", { exact: true })).toBeVisible();
		await expect(page.getByLabel("신청 사유")).toBeVisible();
		await expect(page.getByRole("button", { name: "신청 제출" })).toBeEnabled();
	});

	test("신청 제출 시 생성 API를 호출해야 한다", async ({ page }) => {
		let createBody: Record<string, unknown> | undefined;
		await page.route("**/api/v1/tenant-access-requests", async (route) => {
			if (route.request().method() !== "POST") {
				await route.continue();
				return;
			}
			createBody = route.request().postDataJSON() as Record<string, unknown>;
			await route.fulfill({
				status: 201,
				contentType: "application/json",
				body: JSON.stringify({
					data: {
						id: "11111111-1111-4111-8111-111111111111",
						...createBody,
						status: "PENDING",
					},
				}),
			});
		});

		await page.goto("/tenant-access-requests/new");
		await page.waitForLoadState("networkidle");
		await page
			.getByLabel("신청 사유")
			.fill("프로젝트 운영 현황을 확인해야 합니다.");
		await page.getByRole("button", { name: "신청 제출" }).click();

		await expect
			.poll(() => createBody)
			.toEqual({
				spaceId: "33333333-3333-4333-8333-333333333333",
				requestedRoleId: "44444444-4444-4444-8444-444444444444",
				reason: "프로젝트 운영 현황을 확인해야 합니다.",
			});
	});
});

async function mockCreateForm(page: Page) {
	await page.route(
		"**/api/v1/tenant-access-requests/form/create**",
		async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					data: {
						mode: "CREATE",
						defaultObject: {
							spaceId: "33333333-3333-4333-8333-333333333333",
							requestedRoleId: "44444444-4444-4444-8444-444444444444",
							reason: "",
						},
						options: {
							spaceId: [
								{
									value: "33333333-3333-4333-8333-333333333333",
									label: "플랫폼 운영본부",
									description: "서울특별시 강남구 테스트로 1",
								},
							],
							requestedRoleId: [
								{
									value: "44444444-4444-4444-8444-444444444444",
									label: "조회",
									description: "VIEW",
								},
							],
						},
						ui: {
							readOnlyPaths: [],
							hiddenPaths: [],
							disabledPaths: [],
						},
						fieldMeta: {},
						aiSchemas: [],
					},
				}),
			});
		},
	);
}

async function mockMyTenantAccessRequests(page: Page) {
	await page.route("**/api/v1/tenant-access-requests/my**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: [],
				meta: {
					total: 0,
					skip: 0,
					take: 20,
					totalPages: 0,
				},
			}),
		});
	});
}
