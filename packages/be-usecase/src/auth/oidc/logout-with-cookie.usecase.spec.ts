import { LogoutWithCookieCommand } from "@cocrepo/command";
import type { Response } from "express";
import { LogoutWithCookieUseCase } from "./logout-with-cookie.usecase";

function createJwt(payload: Record<string, unknown>): string {
	return [
		Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString(
			"base64url",
		),
		Buffer.from(JSON.stringify(payload)).toString("base64url"),
		"signature",
	].join(".");
}

function createStoredIdToken(
	claims: Partial<{ iss: string; aud: string | string[]; exp: number }> = {},
): string {
	return createJwt({
		iss: "http://localhost:3007",
		aud: "admin-web",
		exp: Math.floor(Date.now() / 1000) + 3600,
		...claims,
	});
}

function createClient() {
	return {
		clientId: "admin-web",
		clientSecret: "secret",
		redirectUris: ["http://localhost:3000/api/v1/auth/callback"],
		loginUrl: "http://localhost:3000/admin/auth/login",
		postLogoutRedirectUris: ["http://localhost:3000/admin/auth/login"],
		scope: "openid profile email",
		isActive: true,
	};
}

function createMocks() {
	const accessToken = createJwt({
		sub: "01J00000000000000000001001",
		exp: Math.floor(Date.now() / 1000) + 600,
	});
	const oidcClientService = {
		getByClientId: jest.fn().mockResolvedValue(createClient()),
	};
	const storedIdToken = createStoredIdToken();
	const oidcClient = {
		issuer: "http://localhost:3007",
		revokeToken: jest.fn().mockResolvedValue(undefined),
		buildEndSessionUrl: jest
			.fn()
			.mockImplementation(
				(
					idTokenHint: string | null,
					options: { postLogoutRedirectUri?: string; clientId?: string } = {},
				) => {
					const endSessionParams = new URLSearchParams();
					if (idTokenHint) {
						endSessionParams.set("id_token_hint", idTokenHint);
					}
					if (options.postLogoutRedirectUri) {
						endSessionParams.set(
							"post_logout_redirect_uri",
							options.postLogoutRedirectUri,
						);
					}
					if (options.clientId) {
						endSessionParams.set("client_id", options.clientId);
					}
					return `http://localhost:3007/oidc/session/end?${endSessionParams.toString()}`;
				},
			),
	};
	const tokenStorageService = {
		getSessionBySessionId: jest.fn().mockResolvedValue({
			userId: "01J00000000000000000001001",
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			session: {
				refreshToken: "stored-refresh-token",
				idToken: storedIdToken,
			},
		}),
		addToBlacklist: jest.fn().mockResolvedValue(undefined),
		deleteSession: jest.fn().mockResolvedValue(undefined),
		deleteRefreshToken: jest.fn().mockResolvedValue(undefined),
	};
	const tokenService = {
		clearTokenCookies: jest.fn(),
	};
	const res = {
		clearCookie: jest.fn(),
	} as unknown as Response;

	const useCase = new LogoutWithCookieUseCase(
		oidcClientService as unknown as ConstructorParameters<
			typeof LogoutWithCookieUseCase
		>[0],
		oidcClient as unknown as ConstructorParameters<
			typeof LogoutWithCookieUseCase
		>[1],
		tokenStorageService as unknown as ConstructorParameters<
			typeof LogoutWithCookieUseCase
		>[2],
		tokenService as unknown as ConstructorParameters<
			typeof LogoutWithCookieUseCase
		>[3],
	);

	return {
		accessToken,
		storedIdToken,
		oidcClient,
		oidcClientService,
		tokenStorageService,
		tokenService,
		res,
		useCase,
	};
}

function createLogoutCommand(
	overrides: Partial<
		Pick<LogoutWithCookieCommand, "accessTokenCookie" | "sessionId">
	> & { res: Response },
) {
	return new LogoutWithCookieCommand(
		overrides.accessTokenCookie,
		undefined,
		overrides.sessionId,
		overrides.res,
	);
}

describe("LogoutWithCookieUseCase", () => {
	it("세션 레코드의 ID Token으로 클라이언트 등록 URI가 포함된 end_session URL을 반환한다", async () => {
		const mocks = createMocks();
		const command = createLogoutCommand({
			accessTokenCookie: mocks.accessToken,
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			res: mocks.res,
		});

		const result = await mocks.useCase.execute(command);

		expect(
			mocks.tokenStorageService.getSessionBySessionId,
		).toHaveBeenCalledWith("admin-web.0123456789abcdef0123456789abcdef");
		expect(mocks.oidcClient.buildEndSessionUrl).toHaveBeenCalledWith(
			mocks.storedIdToken,
			{
				postLogoutRedirectUri: "http://localhost:3000/admin/auth/login",
				clientId: "admin-web",
			},
		);
		expect(result.endSessionUrl).toBe(
			`http://localhost:3007/oidc/session/end?id_token_hint=${mocks.storedIdToken}&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fadmin%2Fauth%2Flogin&client_id=admin-web`,
		);
	});

	it("만료된 ID Token은 id_token_hint에서 제외해 확인 화면 경유 URL을 반환한다", async () => {
		const mocks = createMocks();
		mocks.tokenStorageService.getSessionBySessionId.mockResolvedValue({
			userId: "01J00000000000000000001001",
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			session: {
				refreshToken: "stored-refresh-token",
				idToken: createStoredIdToken({
					exp: Math.floor(Date.now() / 1000) - 1,
				}),
			},
		});
		const command = createLogoutCommand({
			accessTokenCookie: mocks.accessToken,
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			res: mocks.res,
		});

		const result = await mocks.useCase.execute(command);

		expect(mocks.oidcClient.buildEndSessionUrl).toHaveBeenCalledWith(null, {
			postLogoutRedirectUri: "http://localhost:3000/admin/auth/login",
			clientId: "admin-web",
		});
		expect(result.endSessionUrl).not.toContain("id_token_hint");
	});

	it("발급자가 현재 OP와 다른 ID Token(발급자 단일화 이전 세션)은 id_token_hint에서 제외한다", async () => {
		const mocks = createMocks();
		mocks.tokenStorageService.getSessionBySessionId.mockResolvedValue({
			userId: "01J00000000000000000001001",
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			session: {
				refreshToken: "stored-refresh-token",
				idToken: createStoredIdToken({ iss: "http://localhost:3000" }),
			},
		});
		const command = createLogoutCommand({
			accessTokenCookie: mocks.accessToken,
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			res: mocks.res,
		});

		const result = await mocks.useCase.execute(command);

		expect(mocks.oidcClient.buildEndSessionUrl).toHaveBeenCalledWith(null, {
			postLogoutRedirectUri: "http://localhost:3000/admin/auth/login",
			clientId: "admin-web",
		});
		expect(result.endSessionUrl).not.toContain("id_token_hint");
	});

	it("audience가 클라이언트와 다른 ID Token은 id_token_hint에서 제외한다", async () => {
		const mocks = createMocks();
		mocks.tokenStorageService.getSessionBySessionId.mockResolvedValue({
			userId: "01J00000000000000000001001",
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			session: {
				refreshToken: "stored-refresh-token",
				idToken: createStoredIdToken({ aud: "other-client" }),
			},
		});
		const command = createLogoutCommand({
			accessTokenCookie: mocks.accessToken,
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			res: mocks.res,
		});

		const result = await mocks.useCase.execute(command);

		expect(mocks.oidcClient.buildEndSessionUrl).toHaveBeenCalledWith(null, {
			postLogoutRedirectUri: "http://localhost:3000/admin/auth/login",
			clientId: "admin-web",
		});
		expect(result.endSessionUrl).not.toContain("id_token_hint");
	});

	it("RP 쿠키만 지우고 OP 세션 쿠키(_session 등)는 직접 지우지 않는다", async () => {
		const mocks = createMocks();
		const command = createLogoutCommand({
			accessTokenCookie: mocks.accessToken,
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			res: mocks.res,
		});

		await mocks.useCase.execute(command);

		const clearedCookieNames = (
			mocks.res.clearCookie as jest.Mock
		).mock.calls.map(([cookieName]) => cookieName);
		expect(clearedCookieNames).toEqual(
			expect.not.arrayContaining(["_session", "_interaction"]),
		);
		expect(clearedCookieNames).toContain("sessionId");
		expect(mocks.tokenService.clearTokenCookies).toHaveBeenCalledWith(
			mocks.res,
		);
	});

	it("access 토큰을 폐기·블랙리스트에 추가하고 세션 레코드를 삭제한다", async () => {
		const mocks = createMocks();
		const command = createLogoutCommand({
			accessTokenCookie: mocks.accessToken,
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			res: mocks.res,
		});

		await mocks.useCase.execute(command);

		expect(mocks.oidcClient.revokeToken).toHaveBeenCalledWith(
			mocks.accessToken,
			expect.objectContaining({ clientId: "admin-web" }),
		);
		expect(mocks.tokenStorageService.addToBlacklist).toHaveBeenCalledWith(
			mocks.accessToken,
			expect.any(Number),
		);
		expect(mocks.tokenStorageService.deleteSession).toHaveBeenCalledWith(
			"01J00000000000000000001001",
			"admin-web.0123456789abcdef0123456789abcdef",
		);
	});

	it("세션 레코드에 ID Token이 없으면 client_id만 담은 확인 화면 end_session URL을 반환한다", async () => {
		const mocks = createMocks();
		mocks.tokenStorageService.getSessionBySessionId.mockResolvedValue({
			userId: "01J00000000000000000001001",
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			session: { refreshToken: "stored-refresh-token" },
		});
		const command = createLogoutCommand({
			accessTokenCookie: mocks.accessToken,
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			res: mocks.res,
		});

		const result = await mocks.useCase.execute(command);

		expect(mocks.oidcClient.buildEndSessionUrl).toHaveBeenCalledWith(null, {
			postLogoutRedirectUri: "http://localhost:3000/admin/auth/login",
			clientId: "admin-web",
		});
		expect(result.endSessionUrl).toBe(
			"http://localhost:3007/oidc/session/end?post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fadmin%2Fauth%2Flogin&client_id=admin-web",
		);
	});

	it("OIDC 클라이언트 조회가 실패해도 쿠키 정리와 세션 삭제는 계속한다", async () => {
		const mocks = createMocks();
		mocks.oidcClientService.getByClientId.mockRejectedValue(
			new Error("db unavailable"),
		);
		const command = createLogoutCommand({
			accessTokenCookie: mocks.accessToken,
			sessionId: "admin-web.0123456789abcdef0123456789abcdef",
			res: mocks.res,
		});

		const result = await mocks.useCase.execute(command);

		expect(result.endSessionUrl).toBeNull();
		expect(mocks.oidcClient.revokeToken).not.toHaveBeenCalled();
		expect(mocks.tokenService.clearTokenCookies).toHaveBeenCalledWith(
			mocks.res,
		);
		const clearedCookieNames = (
			mocks.res.clearCookie as jest.Mock
		).mock.calls.map(([cookieName]) => cookieName);
		expect(clearedCookieNames).toContain("sessionId");
		// OP 폐기 외 토큰 정리(블랙리스트/세션 삭제)는 클라이언트와 무관하게 계속한다.
		expect(mocks.tokenStorageService.addToBlacklist).toHaveBeenCalled();
		expect(mocks.tokenStorageService.deleteSession).toHaveBeenCalled();
	});

	it("sessionId가 없으면 세션 조회 없이 사용자 refresh 토큰을 삭제한다", async () => {
		const mocks = createMocks();
		const command = createLogoutCommand({
			accessTokenCookie: mocks.accessToken,
			sessionId: undefined,
			res: mocks.res,
		});

		await mocks.useCase.execute(command);

		expect(
			mocks.tokenStorageService.getSessionBySessionId,
		).not.toHaveBeenCalled();
		expect(mocks.tokenStorageService.deleteRefreshToken).toHaveBeenCalledWith(
			"01J00000000000000000001001",
		);
		expect(mocks.tokenStorageService.deleteSession).not.toHaveBeenCalled();
	});
});
