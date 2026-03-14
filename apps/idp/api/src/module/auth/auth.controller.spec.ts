import { AuthApplicationService } from "@cocrepo/app";
import type { SignUpPayloadDto } from "@cocrepo/dto";
import { AuthAuditLogService } from "@cocrepo/service";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
	let controller: AuthController;
	let mockAuthApplicationService: jest.Mocked<AuthApplicationService>;
	let mockAuthAuditLogService: jest.Mocked<AuthAuditLogService>;
	let mockConfigService: jest.Mocked<ConfigService>;

	const mockTokenExpiryInfo = {
		accessTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1시간 후
		refreshTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7일 후
	};

	const mockUser = {
		id: "user-test-id",
		email: "test@example.com",
		name: "Test User",
		selectedSpaceId: null,
		tenants: [
			{
				id: "tenant-test-id",
				spaceId: "space-test-id",
			},
		],
	};

	const mockResponse = {
		cookie: jest.fn().mockReturnThis(),
		clearCookie: jest.fn().mockReturnThis(),
		redirect: jest.fn().mockReturnThis(),
	};

	const mockRequest = {
		cookies: {
			accessToken: "test-access-token",
			refreshToken: "test-refresh-token",
			sessionId: "test-session-id",
		},
		user: mockUser,
		headers: { "user-agent": "test-agent" },
		ip: "127.0.0.1",
		socket: { remoteAddress: "127.0.0.1" },
	};

	beforeEach(async () => {
		mockAuthApplicationService = {
			getAuthorizationUrl: jest.fn(),
			handleOidcCallback: jest.fn(),
			refreshTokenWithIdp: jest.fn(),
			signUp: jest.fn(),
			verifyToken: jest.fn(),
			logoutWithCookie: jest.fn(),
			setTokenCookies: jest.fn(),
			clearTokenCookies: jest.fn(),
		} as unknown as jest.Mocked<AuthApplicationService>;

		mockAuthAuditLogService = {
			getAuditLogs: jest.fn(),
		} as unknown as jest.Mocked<AuthAuditLogService>;

		mockConfigService = {
			get: jest.fn().mockReturnValue("http://localhost:3000"),
		} as unknown as jest.Mocked<ConfigService>;

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthApplicationService,
					useValue: mockAuthApplicationService,
				},
				{ provide: AuthAuditLogService, useValue: mockAuthAuditLogService },
				{ provide: ConfigService, useValue: mockConfigService },
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	it("컨트롤러가 정의되어야 한다", () => {
		expect(controller).toBeDefined();
	});

	describe("login", () => {
		it("OIDC Authorization URL로 리다이렉트해야 한다", async () => {
			// Given
			mockAuthApplicationService.getAuthorizationUrl.mockResolvedValue(
				"https://idp.example.com/oidc/auth?response_type=code&client_id=test",
			);

			// When
			await controller.login(
				undefined as unknown as string,
				mockResponse as unknown as never,
			);

			// Then
			expect(
				mockAuthApplicationService.getAuthorizationUrl,
			).toHaveBeenCalledWith(undefined);
			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"https://idp.example.com/oidc/auth?response_type=code&client_id=test",
			);
		});
	});

	describe("handleCallback", () => {
		it("OIDC 콜백 성공 시 대시보드로 리다이렉트해야 한다", async () => {
			// Given
			mockAuthApplicationService.handleOidcCallback.mockResolvedValue(
				undefined,
			);

			// When
			await controller.handleCallback(
				"auth-code",
				"state-value",
				undefined as unknown as string,
				undefined as unknown as string,
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			// Then
			expect(
				mockAuthApplicationService.handleOidcCallback,
			).toHaveBeenCalledWith(
				"auth-code",
				"state-value",
				mockRequest,
				mockResponse,
			);
			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"http://localhost:3000/admin/dashboard",
			);
		});

		it("OIDC 에러 파라미터가 있으면 로그인 페이지로 리다이렉트해야 한다", async () => {
			// When
			await controller.handleCallback(
				undefined as unknown as string,
				undefined as unknown as string,
				"access_denied",
				"사용자가 인증을 거부했습니다",
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			// Then
			expect(
				mockAuthApplicationService.handleOidcCallback,
			).not.toHaveBeenCalled();
			expect(mockResponse.redirect).toHaveBeenCalledWith(
				expect.stringContaining("/admin/auth/login?error="),
			);
		});

		it("콜백 처리 실패 시 에러와 함께 로그인 페이지로 리다이렉트해야 한다", async () => {
			// Given
			mockAuthApplicationService.handleOidcCallback.mockRejectedValue(
				new UnauthorizedException("OIDC state 검증에 실패했습니다"),
			);

			// When
			await controller.handleCallback(
				"auth-code",
				"invalid-state",
				undefined as unknown as string,
				undefined as unknown as string,
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			// Then
			expect(mockResponse.redirect).toHaveBeenCalledWith(
				expect.stringContaining("/admin/auth/login?error="),
			);
		});
	});

	describe("refreshToken", () => {
		it("리프레시 토큰이 있으면 IDP에서 새 토큰을 발급해야 한다", async () => {
			// Given
			mockAuthApplicationService.refreshTokenWithIdp.mockResolvedValue({
				accessToken: "new-access-token",
				refreshToken: "new-refresh-token",
				accessTokenExpiresAt: mockTokenExpiryInfo.accessTokenExpiresAt,
				refreshTokenExpiresAt: mockTokenExpiryInfo.refreshTokenExpiresAt,
				user: mockUser as never,
			});

			// When
			const result = await controller.refreshToken(
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			// Then
			expect(
				mockAuthApplicationService.refreshTokenWithIdp,
			).toHaveBeenCalledWith(
				"test-refresh-token",
				"test-session-id",
				mockResponse,
			);
			expect(result.accessToken).toBe("new-access-token");
			expect(result.accessTokenExpiresAt).toBe(
				mockTokenExpiryInfo.accessTokenExpiresAt,
			);
			expect(result.refreshTokenExpiresAt).toBe(
				mockTokenExpiryInfo.refreshTokenExpiresAt,
			);
		});

		it("리프레시 토큰이 없으면 UnauthorizedException을 던져야 한다", async () => {
			// Given
			const requestWithoutToken = { cookies: {} };
			mockAuthApplicationService.refreshTokenWithIdp.mockRejectedValue(
				new UnauthorizedException("리프레시 토큰이 존재하지 않습니다"),
			);

			// When & Then
			await expect(
				controller.refreshToken(
					requestWithoutToken as unknown as never,
					mockResponse as unknown as never,
				),
			).rejects.toThrow(UnauthorizedException);
		});

		it("사용자를 찾을 수 없으면 UnauthorizedException을 던져야 한다", async () => {
			// Given
			mockAuthApplicationService.refreshTokenWithIdp.mockRejectedValue(
				new UnauthorizedException("사용자를 찾을 수 없습니다"),
			);

			// When & Then
			await expect(
				controller.refreshToken(
					mockRequest as unknown as never,
					mockResponse as unknown as never,
				),
			).rejects.toThrow(UnauthorizedException);
		});
	});

	describe("signUp", () => {
		it("회원가입이 성공해야 한다", async () => {
			// Given
			const signUpDto: SignUpPayloadDto = {
				email: "new@example.com",
				password: "password123",
				name: "New User",
			} as never;
			const signUpResult = {
				userId: "user-test-id",
				email: "new@example.com",
			};
			mockAuthApplicationService.signUp.mockResolvedValue(
				signUpResult as never,
			);

			// When
			const result = await controller.signUp(signUpDto);

			// Then
			expect(mockAuthApplicationService.signUp).toHaveBeenCalledWith(signUpDto);
			expect(result).toEqual(signUpResult);
		});
	});

	describe("verifyToken", () => {
		it("유효한 토큰은 만료 시간 정보를 반환해야 한다", async () => {
			// Given
			mockAuthApplicationService.verifyToken.mockReturnValue({
				valid: true,
				accessTokenExpiresAt: mockTokenExpiryInfo.accessTokenExpiresAt,
				refreshTokenExpiresAt: mockTokenExpiryInfo.refreshTokenExpiresAt,
			} as never);

			// When
			const result = (await controller.verifyToken()) as unknown as {
				valid: boolean;
				accessTokenExpiresAt: number;
				refreshTokenExpiresAt: number;
			};

			// Then
			expect(mockAuthApplicationService.verifyToken).toHaveBeenCalled();
			expect(result.valid).toBe(true);
			expect(result.accessTokenExpiresAt).toBe(
				mockTokenExpiryInfo.accessTokenExpiresAt,
			);
			expect(result.refreshTokenExpiresAt).toBe(
				mockTokenExpiryInfo.refreshTokenExpiresAt,
			);
		});

		it("토큰이 없으면 UnauthorizedException을 던져야 한다", async () => {
			// Given
			mockAuthApplicationService.verifyToken.mockImplementation(() => {
				throw new UnauthorizedException("토큰이 존재하지 않습니다");
			});

			// When & Then
			await expect(controller.verifyToken()).rejects.toThrow(
				UnauthorizedException,
			);
		});
	});

	describe("logout", () => {
		it("액세스 토큰이 있으면 토큰을 무효화해야 한다", async () => {
			// Given
			mockAuthApplicationService.logoutWithCookie.mockResolvedValue(true);

			// When
			const result = await controller.logout(
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			// Then
			expect(mockAuthApplicationService.logoutWithCookie).toHaveBeenCalledWith(
				"test-access-token",
				"test-session-id",
				mockResponse,
			);
			expect(result).toBe(true);
		});

		it("액세스 토큰이 없어도 쿠키를 삭제해야 한다", async () => {
			// Given
			const requestWithoutToken = {
				cookies: {},
				user: undefined,
			};
			mockAuthApplicationService.logoutWithCookie.mockResolvedValue(true);

			// When
			const result = await controller.logout(
				requestWithoutToken as unknown as never,
				mockResponse as unknown as never,
			);

			// Then
			expect(mockAuthApplicationService.logoutWithCookie).toHaveBeenCalledWith(
				undefined,
				undefined,
				mockResponse,
			);
			expect(result).toBe(true);
		});
	});
});
