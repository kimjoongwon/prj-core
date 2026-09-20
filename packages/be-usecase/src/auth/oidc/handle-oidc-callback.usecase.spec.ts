import { HandleOidcCallbackCommand } from "@cocrepo/command";
import { AUTH_ERRORS } from "@cocrepo/constant";
import type { Request, Response } from "express";
import { HandleOidcCallbackUseCase } from "./handle-oidc-callback.usecase";

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
		redirectUris: ["https://api.example.com/callback"],
		loginUrl: "https://admin.example.com/login",
		defaultReturnTo: "https://admin.example.com",
		scope: "openid profile email",
		isActive: true,
		...overrides,
	};
}

function createHttp() {
	type RequestDouble = {
		headers: Record<string, string>;
		socket: Record<string, never>;
	};
	type ResponseDouble = {
		cookie: jest.Mock;
	};

	return {
		req: {
			headers: {
				"x-forwarded-for": "198.51.100.7",
				"user-agent": "browser/1.0",
			},
			socket: {},
		} satisfies RequestDouble as unknown as Request,
		res: {
			cookie: jest.fn(),
		} satisfies ResponseDouble as unknown as Response,
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
		exchangeCodeForTokens: jest.fn().mockResolvedValue({
			access_token: createJwt({
				sub: user.userId,
				exp: Math.floor(Date.now() / 1000) + 3600,
			}),
			refresh_token: "refresh-token",
			id_token: "header.id-token-payload.signature",
		}),
	};
	const tokenStorageService = {
		validateAndConsumeOidcState: jest.fn().mockResolvedValue({
			codeVerifier: "verifier",
			returnTo: "/after-login",
			clientId: "admin-web",
		}),
		generateSessionId: jest
			.fn()
			.mockReturnValue("0123456789abcdef0123456789abcdef"),
		saveSession: jest.fn().mockResolvedValue(undefined),
	};
	const authCacheService = {
		set: jest.fn().mockResolvedValue(undefined),
	};
	const usersService = {
		findByUserIdWithTenants: jest.fn().mockResolvedValue(user),
	};
	const tokenService = {
		setAccessTokenCookie: jest.fn(),
		setRefreshTokenCookie: jest.fn(),
	};
	const useCase = new HandleOidcCallbackUseCase(
		oidcClientService as unknown as ConstructorParameters<
			typeof HandleOidcCallbackUseCase
		>[0],
		oidcClient as unknown as ConstructorParameters<
			typeof HandleOidcCallbackUseCase
		>[1],
		tokenStorageService as unknown as ConstructorParameters<
			typeof HandleOidcCallbackUseCase
		>[2],
		authCacheService as unknown as ConstructorParameters<
			typeof HandleOidcCallbackUseCase
		>[3],
		usersService as unknown as ConstructorParameters<
			typeof HandleOidcCallbackUseCase
		>[4],
		tokenService as unknown as ConstructorParameters<
			typeof HandleOidcCallbackUseCase
		>[5],
	);

	return {
		authCacheService,
		oidcClient,
		oidcClientService,
		tokenService,
		tokenStorageService,
		useCase,
		user,
		usersService,
	};
}

describe("HandleOidcCallbackUseCase", () => {
	it("Given OIDC error와 loginUrl When callback 처리하면 Then error redirect를 반환한다", async () => {
		const { req, res } = createHttp();
		const { useCase } = createUseCase();

		const result = await useCase.execute(
			new HandleOidcCallbackCommand(
				"admin-web",
				"",
				"",
				"access_denied",
				"denied",
				req,
				res,
			),
		);

		expect(result).toEqual({
			kind: "redirect",
			url: "https://admin.example.com/login?error=denied",
		});
	});

	it("Given OIDC error와 loginUrl 없음 When callback 처리하면 Then send 응답을 반환한다", async () => {
		const { req, res } = createHttp();
		const { oidcClientService, useCase } = createUseCase();
		oidcClientService.getByClientId.mockResolvedValue(
			createClient({ loginUrl: null }),
		);

		const result = await useCase.execute(
			new HandleOidcCallbackCommand(
				"admin-web",
				"",
				"",
				"access_denied",
				"",
				req,
				res,
			),
		);

		expect(result).toEqual({
			kind: "send",
			statusCode: 400,
			body: "access_denied",
		});
	});

	it("Given 정상 code/state When callback 처리하면 Then 세션 저장 후 성공 redirect를 반환한다", async () => {
		const { req, res } = createHttp();
		const {
			oidcClient,
			tokenService,
			tokenStorageService,
			useCase,
			user,
			usersService,
		} = createUseCase();

		const result = await useCase.execute(
			new HandleOidcCallbackCommand(
				"admin-web",
				"auth-code",
				"state",
				"",
				"",
				req,
				res,
			),
		);

		expect(oidcClient.exchangeCodeForTokens).toHaveBeenCalledWith(
			"auth-code",
			"verifier",
			expect.objectContaining({ clientId: "admin-web" }),
		);
		expect(usersService.findByUserIdWithTenants).toHaveBeenCalledWith(
			user.userId,
		);
		expect(tokenStorageService.saveSession).toHaveBeenCalledWith(
			user.userId,
			"admin-web.0123456789abcdef0123456789abcdef",
			"refresh-token",
			{
				userAgent: "browser/1.0",
				ipAddress: "198.51.100.7",
				clientId: "admin-web",
				idToken: "header.id-token-payload.signature",
			},
		);
		expect(tokenService.setAccessTokenCookie).toHaveBeenCalled();
		expect(tokenService.setRefreshTokenCookie).toHaveBeenCalled();
		expect(res.cookie).toHaveBeenCalledWith(
			"sessionId",
			"admin-web.0123456789abcdef0123456789abcdef",
			expect.any(Object),
		);
		expect(result).toEqual({
			kind: "redirect",
			url: "/after-login",
		});
	});

	it("Given callback 실패와 loginUrl When 처리하면 Then 실패 fallback redirect를 반환한다", async () => {
		const { req, res } = createHttp();
		const { tokenStorageService, useCase } = createUseCase();
		tokenStorageService.validateAndConsumeOidcState.mockResolvedValue(null);
		const fallbackUrl = new URL("https://admin.example.com/login");
		fallbackUrl.searchParams.set("error", AUTH_ERRORS.OIDC_CALLBACK_FAILED);

		const result = await useCase.execute(
			new HandleOidcCallbackCommand(
				"admin-web",
				"auth-code",
				"bad-state",
				"",
				"",
				req,
				res,
			),
		);

		expect(result).toEqual({
			kind: "redirect",
			url: fallbackUrl.toString(),
		});
	});
});
