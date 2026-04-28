import { expect, type Page, test } from "@playwright/test";

const REQUEST_ID = "11111111-1111-4111-8111-111111111111";
const SPACE_ID = "33333333-3333-4333-8333-333333333333";

test.describe("Admin 접근 승인 목록 페이지", () => {
	test.beforeEach(async ({ page }) => {
		await mockAdminShell(page);
		await mockReviewList(page);
	});

	test("승인 목록과 대기 요약이 표시되어야 한다", async ({ page }) => {
		await page.goto("./tenant-access-requests");
		await page.waitForLoadState("networkidle");

		await expect(
			page.getByRole("heading", { name: "접근 승인" }),
		).toBeVisible();
		await expect(page.getByText("전체 신청")).toBeVisible();
		await expect(page.getByText("승인 대기")).toBeVisible();
		await expect(
			page.getByRole("main").getByText("플랫폼 운영본부"),
		).toBeVisible();
		await expect(page.getByText("조회", { exact: true })).toBeVisible();
		await expect(page.getByText("requester@example.com")).toBeVisible();
	});

	test("보기 버튼을 누르면 승인 상세 화면으로 이동해야 한다", async ({
		page,
	}) => {
		await page.goto("./tenant-access-requests");
		await page.waitForLoadState("networkidle");

		await page.getByRole("button", { name: "보기" }).click();

		await expect(page).toHaveURL(
			new RegExp(`/tenant-access-requests/${REQUEST_ID}$`),
		);
	});
});

async function mockAdminShell(page: Page) {
	await page.addInitScript(
		({ spaceId }) => {
			window.localStorage.setItem(
				"admin-persist",
				JSON.stringify({
					spaceId,
					groundName: "플랫폼 운영본부",
					spaces: [{ spaceId, groundName: "플랫폼 운영본부" }],
					accessTokenExpiresAt: Date.now() + 60 * 60 * 1000,
					refreshTokenExpiresAt: Date.now() + 2 * 60 * 60 * 1000,
				}),
			);
		},
		{ spaceId: SPACE_ID },
	);
	await page.route("**/api/v1/auth/verify-token", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: {
					valid: true,
					hasFullAccess: true,
				},
			}),
		});
	});
	await page.route("**/api/v1/auth/current-space", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: {
					id: SPACE_ID,
					ground: {
						name: "플랫폼 운영본부",
					},
				},
			}),
		});
	});
	await page.route("**/api/v1/auth/my-spaces", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: [
					{
						id: SPACE_ID,
						ground: {
							name: "플랫폼 운영본부",
						},
					},
				],
			}),
		});
	});
	await page.route("**/api/v1/abilities**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: [],
				meta: { total: 0 },
			}),
		});
	});
}

async function mockReviewList(page: Page) {
	await page.route("**/api/v1/tenant-access-requests**", async (route) => {
		const url = new URL(route.request().url());
		if (
			route.request().method() !== "GET" ||
			!url.pathname.endsWith("/api/v1/tenant-access-requests")
		) {
			await route.continue();
			return;
		}

		const isPendingCount = url.searchParams.get("status") === "PENDING";
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: isPendingCount ? [] : [buildRequest()],
				meta: {
					total: 1,
					skip: Number(url.searchParams.get("skip") ?? 0),
					take: Number(url.searchParams.get("take") ?? 20),
					totalPages: 1,
				},
			}),
		});
	});
}

function buildRequest() {
	return {
		id: REQUEST_ID,
		requesterId: "22222222-2222-4222-8222-222222222222",
		spaceId: SPACE_ID,
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
		requester: {
			id: "22222222-2222-4222-8222-222222222222",
			name: "신청자",
			email: "requester@example.com",
		},
		space: {
			id: SPACE_ID,
			ground: {
				name: "플랫폼 운영본부",
			},
		},
		requestedRole: {
			id: "44444444-4444-4444-8444-444444444444",
			name: "VIEW",
			displayName: "조회",
		},
	};
}
