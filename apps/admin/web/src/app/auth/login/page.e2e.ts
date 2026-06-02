import { expect, type Page, test } from "@playwright/test";

const LOCAL_ADMIN_LOGIN_EMAIL =
	process.env.E2E_ADMIN_EMAIL ?? "admin@plate.com";
const LOCAL_ADMIN_LOGIN_PASSWORD =
	process.env.E2E_ADMIN_PASSWORD ?? "rkdmf12!@";
const SPACE_ID = "space-admin-login-e2e";

const routeAuthenticatedAdminShellApis = async (page: Page) => {
	await page.route("**/api/v1/auth/verify-token**", async (route) => {
		await route.fulfill({
			json: {
				data: {
					valid: true,
					hasFullAccess: true,
				},
			},
		});
	});
	await page.route("**/api/v1/auth/current-space**", async (route) => {
		await route.fulfill({
			json: {
				data: {
					id: SPACE_ID,
					ground: {
						name: "플랫폼 운영본부",
					},
				},
			},
		});
	});
	await page.route("**/api/v1/auth/my-spaces**", async (route) => {
		await route.fulfill({
			json: {
				data: [
					{
						id: SPACE_ID,
						ground: {
							name: "플랫폼 운영본부",
						},
					},
				],
			},
		});
	});
};

test.describe("로그인 페이지 테스트", () => {
	test("로그인 페이지 진입 시 native 로그인 폼이 표시되어야 한다", async ({
		page,
	}) => {
		await page.goto("auth/login");

		await expect(
			page.getByRole("heading", { name: "관리자 로그인", exact: true }),
		).toBeVisible({ timeout: 30000 });
		await expect(page.getByLabel("이메일")).toBeVisible();
		await expect(page.getByLabel("비밀번호")).toBeVisible();
		await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
	});

	test("로컬 개발 기본 관리자 계정으로 로그인에 성공해야 한다", async ({
		page,
	}) => {
		await routeAuthenticatedAdminShellApis(page);
		await page.goto("auth/login");

		await expect(page.getByLabel("이메일")).toHaveValue(LOCAL_ADMIN_LOGIN_EMAIL);
		await expect(page.getByLabel("비밀번호")).toHaveValue(
			LOCAL_ADMIN_LOGIN_PASSWORD,
		);

		const loginRequestPromise = page.waitForRequest(
			(request) =>
				request.url().endsWith("/api/v1/auth/native/login") &&
				request.method() === "POST",
		);
		const loginResponsePromise = page.waitForResponse(
			(response) =>
				response.url().endsWith("/api/v1/auth/native/login") &&
				response.status() === 200,
		);

		await page.getByRole("button", { name: "로그인" }).click();

		const loginRequest = await loginRequestPromise;
		expect(loginRequest.postDataJSON()).toEqual({
			email: LOCAL_ADMIN_LOGIN_EMAIL,
			password: LOCAL_ADMIN_LOGIN_PASSWORD,
		});
		await loginResponsePromise;

		await expect(page).toHaveURL(/\/dashboard(?:[/?#]|$)/);
		await expect
			.poll(() =>
				page.evaluate(() => {
					const value = window.localStorage.getItem("admin-persist");
					if (!value) {
						return null;
					}

					const data = JSON.parse(value) as {
						accessToken?: string;
						refreshToken?: string;
						sessionId?: string;
					};

					return {
						hasAccessToken: Boolean(data.accessToken),
						hasRefreshToken: Boolean(data.refreshToken),
						hasSessionId: Boolean(data.sessionId),
					};
				}),
			)
			.toEqual({
				hasAccessToken: true,
				hasRefreshToken: true,
				hasSessionId: true,
			});
	});
});
