import { expect, test, type Page } from "@playwright/test";

const REQUEST_ID = "11111111-1111-4111-8111-111111111111";
const SPACE_ID = "33333333-3333-4333-8333-333333333333";

test.describe("Admin 접근 신청 상세 페이지", () => {
	test.beforeEach(async ({ page }) => {
		await mockAdminShell(page);
	});

	test("신청 상세와 검토 버튼이 표시되어야 한다", async ({ page }) => {
		await mockReviewDetail(page);

		await page.goto(`./tenant-access-requests/${REQUEST_ID}`);
		await page.waitForLoadState("networkidle");

		await expect(
			page.getByRole("heading", { name: "접근 신청 상세" }),
		).toBeVisible();
		await expect(page.getByText("플랫폼 운영본부")).toBeVisible();
		await expect(page.getByText("조회", { exact: true })).toBeVisible();
		await expect(page.getByText("업무 확인 권한이 필요합니다.")).toBeVisible();
		await expect(page.getByRole("button", { name: "승인" })).toBeEnabled();
		await expect(page.getByRole("button", { name: "반려" })).toBeEnabled();
	});

	test("승인 버튼을 누르면 approve API를 호출해야 한다", async ({ page }) => {
		let approveBody: Record<string, unknown> | undefined;
		await mockReviewDetail(page, {
			onApprove: (body) => {
				approveBody = body;
			},
		});

		await page.goto(`./tenant-access-requests/${REQUEST_ID}`);
		await page.waitForLoadState("networkidle");
		await page.getByLabel("검토 코멘트").fill("요건 확인 완료");
		await page.getByRole("button", { name: "승인" }).click();

		await expect
			.poll(() => approveBody)
			.toEqual({
				reviewComment: "요건 확인 완료",
			});
	});

	test("반려 버튼을 누르면 reject API를 호출해야 한다", async ({ page }) => {
		let rejectBody: Record<string, unknown> | undefined;
		await mockReviewDetail(page, {
			onReject: (body) => {
				rejectBody = body;
			},
		});

		await page.goto(`./tenant-access-requests/${REQUEST_ID}`);
		await page.waitForLoadState("networkidle");
		await page.getByLabel("검토 코멘트").fill("권한 범위 재확인 필요");
		await page.getByRole("button", { name: "반려" }).click();

		await expect
			.poll(() => rejectBody)
			.toEqual({
				reviewComment: "권한 범위 재확인 필요",
			});
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

async function mockReviewDetail(
	page: Page,
	handlers: {
		onApprove?: (body: Record<string, unknown>) => void;
		onReject?: (body: Record<string, unknown>) => void;
	} = {},
) {
	await page.route(
		`**/api/v1/tenant-access-requests/${REQUEST_ID}**`,
		async (route) => {
			const method = route.request().method();
			const url = new URL(route.request().url());

			if (method === "POST" && url.pathname.endsWith("/approve")) {
				const body = route.request().postDataJSON() as Record<string, unknown>;
				handlers.onApprove?.(body ?? {});
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						data: buildRequest({
							status: "APPROVED",
							reviewComment: body?.reviewComment ?? null,
							reviewer: { name: "관리자" },
							reviewedAt: "2026-04-28T09:30:00.000Z",
						}),
					}),
				});
				return;
			}

			if (method === "POST" && url.pathname.endsWith("/reject")) {
				const body = route.request().postDataJSON() as Record<string, unknown>;
				handlers.onReject?.(body ?? {});
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						data: buildRequest({
							status: "REJECTED",
							reviewComment: body?.reviewComment ?? null,
							reviewer: { name: "관리자" },
							reviewedAt: "2026-04-28T09:30:00.000Z",
						}),
					}),
				});
				return;
			}

			if (method === "GET" && url.pathname.endsWith(`/${REQUEST_ID}`)) {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						data: buildRequest(),
					}),
				});
				return;
			}

			await route.continue();
		},
	);
}

function buildRequest(overrides: Record<string, unknown> = {}) {
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
		previousRole: null,
		...overrides,
	};
}
