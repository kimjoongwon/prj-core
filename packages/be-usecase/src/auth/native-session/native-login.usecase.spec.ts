import { NativeLoginCommand } from "@cocrepo/command";
import { MOBILE_NATIVE_CLIENT_ID } from "@cocrepo/constant";
import { HttpException, HttpStatus } from "@nestjs/common";
import { NativeLoginUseCase } from "./native-login.usecase";

function createJwt(payload: Record<string, unknown>): string {
	return [
		Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
			"base64url",
		),
		Buffer.from(JSON.stringify(payload)).toString("base64url"),
		"signature",
	].join(".");
}

function createRequest() {
	return {
		headers: {
			"x-forwarded-for": "203.0.113.10, 10.0.0.1",
			"user-agent": "native-app/1.0",
		},
		socket: {
			remoteAddress: "10.0.0.2",
		},
	} as never;
}

async function expectHttpException(
	action: Promise<unknown>,
	statusCode: HttpStatus,
	response: Record<string, unknown>,
) {
	try {
		await action;
		throw new Error("HttpException이 발생하지 않았습니다.");
	} catch (error) {
		expect(error).toBeInstanceOf(HttpException);
		const exception = error as HttpException;
		expect(exception.getStatus()).toBe(statusCode);
		expect(exception.getResponse()).toEqual(expect.objectContaining(response));
	}
}

function createUseCase() {
	const user = {
		id: "user-1",
		email: "user@example.com",
		name: "사용자",
	};
	const usersService = {
		getByIdWithTenants: jest.fn().mockResolvedValue(user),
	};
	const tokenStorageService = {
		generateSessionId: jest
			.fn()
			.mockReturnValue("0123456789abcdef0123456789abcdef"),
		saveSession: jest.fn().mockResolvedValue(undefined),
	};
	const authCacheService = {
		set: jest.fn().mockResolvedValue(undefined),
	};
	const jwtService = {
		sign: jest.fn(() =>
			createJwt({
				sub: user.id,
				exp: Math.floor(Date.now() / 1000) + 3600,
			}),
		),
	};
	const configService = {
		get: jest.fn((key: string) => {
			if (key === "auth") {
				return { secret: "secret", expires: "1h", refresh: "7d" };
			}
			if (key === "oidc") {
				return { issuer: "https://idp.example.com" };
			}
			return undefined;
		}),
	};
	const interactionLoginService = {
		validateUser: jest.fn(),
	};
	const useCase = new NativeLoginUseCase(
		usersService as never,
		tokenStorageService as never,
		authCacheService as never,
		jwtService as never,
		configService as never,
		interactionLoginService as never,
	);

	return {
		authCacheService,
		configService,
		interactionLoginService,
		jwtService,
		tokenStorageService,
		useCase,
		user,
		usersService,
	};
}

describe("NativeLoginUseCase", () => {
	it("Given 올바른 계정 When native 로그인하면 Then 세션을 저장하고 native 응답을 만든다", async () => {
		const {
			authCacheService,
			interactionLoginService,
			jwtService,
			tokenStorageService,
			useCase,
			user,
		} = createUseCase();
		interactionLoginService.validateUser.mockResolvedValue({
			success: true,
			userId: user.id,
			mustChangePassword: true,
		});

		const result = await useCase.execute(
			new NativeLoginCommand(
				{ email: "user@example.com", password: "password" },
				createRequest(),
			),
		);

		expect(interactionLoginService.validateUser).toHaveBeenCalledWith(
			"user@example.com",
			"password",
			"203.0.113.10",
			"native-app/1.0",
			MOBILE_NATIVE_CLIENT_ID,
		);
		expect(tokenStorageService.saveSession).toHaveBeenCalledWith(
			user.id,
			`${MOBILE_NATIVE_CLIENT_ID}.0123456789abcdef0123456789abcdef`,
			expect.any(String),
			{
				userAgent: "native-app/1.0",
				ipAddress: "203.0.113.10",
				clientId: MOBILE_NATIVE_CLIENT_ID,
			},
		);
		expect(jwtService.sign).toHaveBeenCalledWith(
			{ client_id: MOBILE_NATIVE_CLIENT_ID },
			expect.objectContaining({
				audience: MOBILE_NATIVE_CLIENT_ID,
				issuer: "https://idp.example.com/native",
				subject: user.id,
			}),
		);
		expect(authCacheService.set).toHaveBeenCalledWith(
			user.id,
			JSON.stringify(user),
			expect.any(Number),
		);
		expect(result).toMatchObject({
			sessionId: `${MOBILE_NATIVE_CLIENT_ID}.0123456789abcdef0123456789abcdef`,
			user,
			mustChangePassword: true,
		});
		expect(result.refreshToken).toEqual(expect.any(String));
	});

	it("Given 일반 로그인 실패 When native 로그인하면 Then 401 실패 응답을 던진다", async () => {
		const { interactionLoginService, useCase, usersService } = createUseCase();
		interactionLoginService.validateUser.mockResolvedValue({
			success: false,
			error: "INVALID_CREDENTIALS",
			remainingAttempts: 2,
		});

		await expectHttpException(
			useCase.execute(
				new NativeLoginCommand(
					{ email: "user@example.com", password: "wrong" },
					createRequest(),
				),
			),
			HttpStatus.UNAUTHORIZED,
			{
				error: "INVALID_CREDENTIALS",
				remainingAttempts: 2,
			},
		);
		expect(usersService.getByIdWithTenants).not.toHaveBeenCalled();
	});

	it("Given 잠긴 계정 When native 로그인하면 Then 403 실패 응답을 던진다", async () => {
		const { interactionLoginService, useCase } = createUseCase();
		interactionLoginService.validateUser.mockResolvedValue({
			success: false,
			error: "ACCOUNT_LOCKED_TEMPORARY",
			lockedUntil: new Date("2026-06-20T10:00:00.000Z"),
		});

		await expectHttpException(
			useCase.execute(
				new NativeLoginCommand(
					{ email: "user@example.com", password: "wrong" },
					createRequest(),
				),
			),
			HttpStatus.FORBIDDEN,
			{
				error: "ACCOUNT_LOCKED_TEMPORARY",
				lockedUntil: "2026-06-20T10:00:00.000Z",
			},
		);
	});
});
