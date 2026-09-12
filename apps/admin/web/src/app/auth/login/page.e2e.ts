import { expect, test } from "@playwright/test";

const LOCAL_ADMIN_LOGIN_EMAIL =
	process.env.E2E_ADMIN_EMAIL ?? "admin@plate.com";
const LOCAL_ADMIN_LOGIN_PASSWORD =
	process.env.E2E_ADMIN_PASSWORD ?? "rkdmf12!@";
test.describe("로그인 페이지 테스트 @real", () => {
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

	test("로그인 페이지에서 인증 부트스트랩 API가 호출되지 않아야 한다", async ({
		page,
	}) => {
		const authenticatedApiRequests: string[] = [];
		page.on("request", (request) => {
			const url = request.url();
			if (
				url.endsWith("/api/v1/auth/my-spaces") ||
				url.endsWith("/api/v1/auth/current-space") ||
				url.endsWith("/api/v1/auth/verify-token") ||
				url.endsWith("/api/v1/abilities/my")
			) {
				authenticatedApiRequests.push(url);
			}
		});

		await page.goto("auth/login");

		await expect(
			page.getByRole("heading", { name: "관리자 로그인", exact: true }),
		).toBeVisible({ timeout: 30000 });
		// 부트스트랩이 hydration 직후 바로 발사되던 이전 동작을 잡기 위해
		// 렌더 확인 후에도 잠시 관찰한다.
		await page.waitForTimeout(1500);

		expect(authenticatedApiRequests).toEqual([]);
	});

	test("로컬 개발 기본 관리자 계정으로 로그인에 성공해야 한다", async ({
		page,
	}) => {
		await page.goto("auth/login");

		await expect(page.getByLabel("이메일")).toHaveValue(
			LOCAL_ADMIN_LOGIN_EMAIL,
		);
		await expect(page.getByLabel("비밀번호")).toHaveValue(
			LOCAL_ADMIN_LOGIN_PASSWORD,
		);

		const loginRequestPromise = page.waitForRequest(
			(request) =>
				request.url().endsWith("/api/v1/auth/login") &&
				request.method() === "POST",
		);
		const loginResponsePromise = page.waitForResponse(
			(response) =>
				response.url().endsWith("/api/v1/auth/login") &&
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
						account?: {
							version?: unknown;
						};
						authSession?: {
							accessToken?: unknown;
							refreshToken?: unknown;
							sessionId?: unknown;
						};
					};
					const authSession = data.authSession;

					return {
						accountVersion: data.account?.version ?? null,
						hasAccessToken:
							typeof authSession?.accessToken === "string" &&
							authSession.accessToken.length > 0,
						hasRefreshToken:
							typeof authSession?.refreshToken === "string" &&
							authSession.refreshToken.length > 0,
						hasSessionId:
							typeof authSession?.sessionId === "string" &&
							authSession.sessionId.length > 0,
					};
				}),
			)
			.toEqual({
				accountVersion: 2,
				hasAccessToken: true,
				hasRefreshToken: true,
				hasSessionId: true,
			});
	});
});
