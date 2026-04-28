import { loginToConsole } from "@cocrepo/e2e";
import { expect, type Page, test } from "@playwright/test";

const REQUEST_ID = "11111111-1111-4111-8111-111111111111";

test.describe("IDP 접근 신청 목록 페이지", () => {
	test.beforeEach(async ({ page }) => {
		await mockMyTenantAccessRequests(page);
		await loginToConsole(page);
	});

	test("내 신청 목록과 신청하기 버튼이 표시되어야 한다", async ({ page }) => {
		await page.goto("/tenant-access-requests");
		await page.waitForLoadState("networkidle");

		await expect(
			page.getByRole("heading", { name: "접근 신청", exact: true }),
		).toBeVisible();
		await expect(page.getByText("내 신청 목록")).toBeVisible();
		await expect(page.getByText("플랫폼 운영본부")).toBeVisible();
		await expect(page.getByText("조회", { exact: true })).toBeVisible();
		await expect(page.getByText("업무 확인 권한이 필요합니다.")).toBeVisible();
		await expect(page.getByRole("button", { name: "신청하기" })).toBeVisible();
	});

	test("신청하기 버튼을 누르면 신규 신청 화면으로 이동해야 한다", async ({
		page,
	}) => {
		await page.goto("/tenant-access-requests");
		await page.waitForLoadState("networkidle");

		await page.getByRole("button", { name: "신청하기" }).click();

		await expect(page).toHaveURL(/\/tenant-access-requests\/new$/);
	});

	test("PENDING 신청을 취소할 수 있어야 한다", async ({ page }) => {
		let cancelCalls = 0;
		await page.route(
			`**/api/v1/tenant-access-requests/${REQUEST_ID}/cancel`,
			async (route) => {
				cancelCalls += 1;
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						data: buildRequest({ status: "CANCELED" }),
					}),
				});
			},
		);

		await page.goto("/tenant-access-requests");
		await page.waitForLoadState("networkidle");
		await page.getByRole("button", { name: "취소" }).click();

		await expect.poll(() => cancelCalls).toBe(1);
	});
});

async function mockMyTenantAccessRequests(page: Page) {
	await page.route("**/api/v1/tenant-access-requests/my**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: [buildRequest()],
				meta: {
					total: 1,
					skip: 0,
					take: 20,
					totalPages: 1,
				},
			}),
		});
	});
}

function buildRequest(overrides: Record<string, unknown> = {}) {
	return {
		id: REQUEST_ID,
		requesterId: "22222222-2222-4222-8222-222222222222",
		spaceId: "33333333-3333-4333-8333-333333333333",
		requestedRoleId: "44444444-4444-4444-8444-444444444444",
		previousRoleId: null,
		reason: "업무 확인 권한이 필요합니다.",
		status: "PENDING",
		reviewerId: null,
		reviewComment: null,
		reviewedAt: null,
		appliedTenantId: null,
		createdAt: "2026-04-28T09:00:00.000Z",
		updatedAt: "2026-04-28T09:00:00.000Z",
		removedAt: null,
		space: {
			id: "33333333-3333-4333-8333-333333333333",
			ground: {
				name: "플랫폼 운영본부",
			},
		},
		requestedRole: {
			id: "44444444-4444-4444-8444-444444444444",
			name: "VIEW",
			displayName: "조회",
		},
		...overrides,
	};
}
