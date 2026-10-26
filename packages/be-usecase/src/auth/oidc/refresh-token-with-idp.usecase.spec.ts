import { RefreshTokenWithIdpCommand } from "@cocrepo/command";
import type { Response } from "express";
import { RefreshTokenWithIdpUseCase } from "./refresh-token-with-idp.usecase";

function createJwt(payload: Record<string, unknown>): string {
	return [
		Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
			"base64url",
		),
		Buffer.from(JSON.stringify(payload)).toString("base64url"),
		"signature",
	].join(".");
}

function createClient(overrides: Record<string, unknown> = {}) {
	return {
		clientId: "admin-web",
		clientSecret: "secret",
		redirectUris: ["http://localhost:3000/api/v1/auth/callback"],
		loginUrl: "http://localhost:3000/admin/auth/login",
		defaultReturnTo: "/admin/dashboard",
		scope: "openid profile email",
		isActive: true,
		...overrides,
	};
}

function createUseCase() {
	const user = {
		id: 101n,
		userId: "01J00000000000000000001001",
		email: "user@example.com",
	};
	const oidcClientService = {
		getByClientId: jest.fn().mockResolvedValue(createClient()),
	};
	const oidcClient = {
		refreshTokens: jest.fn().mockResolvedValue({
			access_token: createJwt({
				sub: user.userId,
				exp: Math.floor(Date.now() / 1000) + 3600,
			}),
			refresh_token: "rotated-refresh-token",
			expires_in: 3600,
		}),
	};
	const usersService = {
		findByUserIdWithTenants: jest.fn().mockResolvedValue(user),
	};
	const tokenStorageService = {
		updateSession: jest.fn().mockResolvedValue(undefined),
	};
	const tokenService = {
		setAccessTokenCookie: jest.fn(),
		setRefreshTokenCookie: jest.fn(),
	};
	const useCase = new RefreshTokenWithIdpUseCase(
		oidcClientService as unknown as ConstructorParameters<
			typeof RefreshTokenWithIdpUseCase
		>[0],
		oidcClient as unknown as ConstructorParameters<
			typeof RefreshTokenWithIdpUseCase
		>[1],
		usersService as unknown as ConstructorParameters<
			typeof RefreshTokenWithIdpUseCase
		>[2],
		tokenStorageService as unknown as ConstructorParameters<
			typeof RefreshTokenWithIdpUseCase
		>[3],
		tokenService as unknown as ConstructorParameters<
			typeof RefreshTokenWithIdpUseCase
		>[4],
	);

	return {
		oidcClient,
		oidcClientService,
		tokenService,
		tokenStorageService,
		useCase,
		user,
		usersService,
	};
}

describe("RefreshTokenWithIdpUseCase", () => {
	it("Given 세션 쿠키 기반 갱신 When 실행하면 Then 회전된 토큰과 sessionId를 함께 반환한다", async () => {
		const { tokenStorageService, useCase } = createUseCase();
		const res = { cookie: jest.fn() } as unknown as Response;

		const result = await useCase.execute(
			new RefreshTokenWithIdpCommand(
				"cookie-refresh-token",
				undefined,
				"admin-web.0123456789abcdef0123456789abcdef",
				res,
			),
		);

		expect(tokenStorageService.updateSession).toHaveBeenCalledWith(
			expect.any(String),
			"admin-web.0123456789abcdef0123456789abcdef",
			"rotated-refresh-token",
		);
		expect(result.sessionId).toBe(
			"admin-web.0123456789abcdef0123456789abcdef",
		);
		expect(result.refreshToken).toBe("rotated-refresh-token");
		expect(res.cookie).toHaveBeenCalledWith(
			"loggedIn",
			"1",
			expect.objectContaining({ httpOnly: false }),
		);
	});

	it("Given 헤더 기반 갱신(sessionId 없음) When 실행하면 Then sessionId를 null로 반환한다", async () => {
		const { tokenStorageService, useCase } = createUseCase();
		const res = { cookie: jest.fn() } as unknown as Response;

		const result = await useCase.execute(
			new RefreshTokenWithIdpCommand(
				undefined,
				"header-refresh-token",
				undefined,
				res,
			),
		);

		expect(tokenStorageService.updateSession).not.toHaveBeenCalled();
		expect(result.sessionId).toBeNull();
	});
});
