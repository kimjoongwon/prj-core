import { loginToConsole } from "@cocrepo/e2e";
import { expect, type Page, test } from "@playwright/test";

const SPACE_ID = "11111111-1111-4111-8111-111111111111";
const ROLE_ID = "22222222-2222-4222-8222-222222222222";
const USER_ID = "33333333-3333-4333-8333-333333333333";

const navigateToFirstAccountDetail = async (page: Page): Promise<string> => {
	await page.goto("/accounts");
	await page.waitForLoadState("domcontentloaded");

	const detailLink = page.locator('a[href^="/accounts/"]').first();
	await expect(detailLink).toBeVisible({ timeout: 10000 });

	const href = await detailLink.getAttribute("href");
	expect(href).toBeTruthy();

	await page.goto(href as string);
	await page.waitForLoadState("domcontentloaded");

	return href as string;
};

const mockAccountAccessGrantApi = async (
	page: Page,
	handlers: {
		onGrantAccess?: (body: Record<string, unknown>) => void;
	} = {},
) => {
	await page.route("**/api/v1/idp/accounts/**", async (route) => {
		const method = route.request().method();
		const url = new URL(route.request().url());

		if (method === "GET" && url.pathname.endsWith("/access-grant-form")) {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					httpStatus: 200,
					message: "계정 접근 권한 부여 폼 조회 성공",
					data: {
						mode: "CREATE",
						defaultObject: {
							spaceId: SPACE_ID,
							roleId: ROLE_ID,
						},
						options: {
							spaceId: [
								{
									value: SPACE_ID,
									label: "플랫폼 운영본부",
									description: "서울 강남구",
								},
							],
							roleId: [
								{
									value: ROLE_ID,
									label: "운영 관리자",
									description: "ops-admin",
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
			return;
		}

		if (method === "POST" && url.pathname.endsWith("/access-grants")) {
			handlers.onGrantAccess?.(
				route.request().postDataJSON() as Record<string, unknown>,
			);
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					httpStatus: 200,
					message: "계정 접근 권한 부여 성공",
					data: buildAccountDetail({
						accessGrants: [
							{
								tenantId: "44444444-4444-4444-8444-444444444444",
								spaceId: SPACE_ID,
								spaceName: "플랫폼 운영본부",
								spaceLabel: "서울 강남구",
								roleId: ROLE_ID,
								roleName: "ops-admin",
								roleDisplayName: "운영 관리자",
								grantedAt: "2026-04-29T09:00:00.000Z",
								updatedAt: null,
							},
						],
					}),
				}),
			});
			return;
		}

		if (
			method === "GET" &&
			/\/api\/v1\/idp\/accounts\/[^/]+$/.test(url.pathname)
		) {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					httpStatus: 200,
					message: "계정 상세 조회 성공",
					data: buildAccountDetail(),
				}),
			});
			return;
		}

		await route.continue();
	});
};

const buildAccountDetail = (overrides: Record<string, unknown> = {}) => ({
	id: USER_ID,
	name: "테스트 계정",
	email: "account-detail@example.com",
	isActive: true,
	failedLoginAttempts: 0,
	isPermanentlyLocked: false,
	lockedUntil: null,
	mustChangePassword: false,
	lastLoginAt: "2026-04-29T08:30:00.000Z",
	lastLoginIp: "127.0.0.1",
	createdAt: "2026-04-01T00:00:00.000Z",
	accessGrants: [
		{
			tenantId: "55555555-5555-4555-8555-555555555555",
			spaceId: "66666666-6666-4666-8666-666666666666",
			spaceName: "기존 Space",
			spaceLabel: "기존 접근 권한",
			roleId: "77777777-7777-4777-8777-777777777777",
			roleName: "viewer",
			roleDisplayName: "조회자",
			grantedAt: "2026-04-20T09:00:00.000Z",
			updatedAt: null,
		},
	],
	...overrides,
});

test.describe("IDP 계정 상세 페이지", () => {
	test("계정 상세 정보가 표시되어야 한다", async ({ page }) => {
		// Given: 로그인 후 상세 페이지 진입
		await loginToConsole(page);
		await navigateToFirstAccountDetail(page);

		// Then: 상세 페이지로 이동하고 보안 정보가 표시됨
		await expect(page).toHaveURL(/\/accounts\/.+/);
		await page.waitForLoadState("networkidle");

		// 보안 정보 섹션 확인
		await expect(page.getByText("보안 정보")).toBeVisible();
		await expect(page.getByText("접근 권한")).toBeVisible();
	});

	test("상세 페이지에서 액션 버튼이 표시되어야 한다", async ({ page }) => {
		// Given: 로그인 후 상세 페이지 진입
		await loginToConsole(page);
		await navigateToFirstAccountDetail(page);
		await page.waitForLoadState("networkidle");

		// Then: 액션 버튼 확인
		await expect(
			page.getByRole("button", { name: "목록으로", exact: true }),
		).toBeVisible();
	});

	test("계정 상세에서 접근 권한을 부여할 수 있어야 한다", async ({ page }) => {
		// Given: 로그인 후 첫 계정 상세 링크를 확보하고 상세/권한 API를 모킹
		await loginToConsole(page);
		await page.goto("/accounts");
		await page.waitForLoadState("domcontentloaded");

		const detailLink = page.locator('a[href^="/accounts/"]').first();
		await expect(detailLink).toBeVisible({ timeout: 10000 });

		const href = await detailLink.getAttribute("href");
		expect(href).toBeTruthy();

		let requestedBody: Record<string, unknown> | undefined;
		await mockAccountAccessGrantApi(page, {
			onGrantAccess: (body) => {
				requestedBody = body;
			},
		});

		// When: 계정 상세에서 기본 Space/Role로 권한 부여
		await page.goto(href as string);
		await page.waitForLoadState("networkidle");

		await expect(page.getByText("접근 권한")).toBeVisible();
		await expect(page.getByText("기존 Space")).toBeVisible();
		await expect(page.getByText("플랫폼 운영본부")).toBeVisible();
		await expect(page.getByText("운영 관리자")).toBeVisible();

		const grantButton = page.getByRole("button", { name: "권한 부여" });
		await expect(grantButton).toBeEnabled();
		await grantButton.click();

		// Then: 선택된 Space/Role로 권한 부여 API를 호출
		await expect
			.poll(() => requestedBody)
			.toEqual({ spaceId: SPACE_ID, roleId: ROLE_ID });
	});
});
