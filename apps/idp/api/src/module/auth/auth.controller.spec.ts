import { AuthApplicationService } from "@cocrepo/app";
import { SKIP_SPACE_CHECK_KEY } from "@cocrepo/decorator";
import type { SignUpPayloadDto } from "@cocrepo/dto";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
	let controller: AuthController;
	let mockAuthApplicationService: jest.Mocked<AuthApplicationService>;
	let mockConfigService: jest.Mocked<ConfigService>;

	const mockOidcConfig = {
		clients: {
			admin: {
				loginUrl: "http://localhost:3000/admin/auth/login",
				defaultReturnTo: "http://localhost:3000/admin/dashboard",
			},
			storybook: {
				loginUrl: "http://localhost:6006/__storybook_auth/login",
				defaultReturnTo: "http://localhost:6006/",
			},
			idpWeb: {
				loginUrl: "http://localhost:3008/auth/login",
				defaultReturnTo: "http://localhost:3008/dashboard",
			},
		},
	};

	const mockTokenExpiryInfo = {
		accessTokenExpiresAt: Date.now() + 60 * 60 * 1000,
		refreshTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
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
			sessionId: "storybook.test-session-id",
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
			getMySpaces: jest.fn(),
			getAuthAuditLogs: jest.fn(),
			getAuthAuditLogStats: jest.fn(),
			changePassword: jest.fn(),
			unlockAccount: jest.fn(),
			forceResetPassword: jest.fn(),
			invalidateUserSessions: jest.fn(),
			getMySessions: jest.fn(),
			revokeSession: jest.fn(),
			revokeOtherSessions: jest.fn(),
		} as unknown as jest.Mocked<AuthApplicationService>;

		mockConfigService = {
			get: jest.fn().mockImplementation((key: string) => {
				if (key === "oidc") {
					return mockOidcConfig;
				}
				return undefined;
			}),
		} as unknown as jest.Mocked<ConfigService>;

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthApplicationService,
					useValue: mockAuthApplicationService,
				},
				{ provide: ConfigService, useValue: mockConfigService },
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
		jest.clearAllMocks();
	});

	it("컨트롤러가 정의되어야 한다", () => {
		expect(controller).toBeDefined();
	});

	describe("login", () => {
		it("admin RP authorization URL로 리다이렉트해야 한다", async () => {
			mockAuthApplicationService.getAuthorizationUrl.mockResolvedValue(
				"https://idp.example.com/oidc/auth?client_id=admin",
			);

			await controller.login(
				undefined as unknown as string,
				mockResponse as unknown as never,
			);

			expect(
				mockAuthApplicationService.getAuthorizationUrl,
			).toHaveBeenCalledWith(undefined, "admin");
			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"https://idp.example.com/oidc/auth?client_id=admin",
			);
		});

		it("storybook RP authorization URL로 리다이렉트해야 한다", async () => {
			mockAuthApplicationService.getAuthorizationUrl.mockResolvedValue(
				"https://idp.example.com/oidc/auth?client_id=storybook",
			);

			await controller.storybookLogin(
				"http://localhost:6006/?path=/story/button",
				mockResponse as unknown as never,
			);

			expect(
				mockAuthApplicationService.getAuthorizationUrl,
			).toHaveBeenCalledWith(
				"http://localhost:6006/?path=/story/button",
				"storybook",
			);
			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"https://idp.example.com/oidc/auth?client_id=storybook",
			);
		});

		it("idpWeb RP authorization URL로 리다이렉트해야 한다", async () => {
			mockAuthApplicationService.getAuthorizationUrl.mockResolvedValue(
				"https://idp.example.com/oidc/auth?client_id=idp-web",
			);

			await controller.idpLogin(
				"http://localhost:3008/dashboard",
				mockResponse as unknown as never,
			);

			expect(
				mockAuthApplicationService.getAuthorizationUrl,
			).toHaveBeenCalledWith("http://localhost:3008/dashboard", "idpWeb");
			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"https://idp.example.com/oidc/auth?client_id=idp-web",
			);
		});
	});

	describe("handleCallback", () => {
		it("admin callback 성공 시 기본 대시보드로 리다이렉트해야 한다", async () => {
			mockAuthApplicationService.handleOidcCallback.mockResolvedValue(
				undefined,
			);

			await controller.handleCallback(
				"auth-code",
				"state-value",
				undefined as unknown as string,
				undefined as unknown as string,
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

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

		it("admin OIDC 에러는 admin 로그인 페이지로 리다이렉트해야 한다", async () => {
			await controller.handleCallback(
				undefined as unknown as string,
				undefined as unknown as string,
				"access_denied",
				"사용자가 인증을 거부했습니다",
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			expect(
				mockAuthApplicationService.handleOidcCallback,
			).not.toHaveBeenCalled();
			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"http://localhost:3000/admin/auth/login?error=%EC%82%AC%EC%9A%A9%EC%9E%90%EA%B0%80+%EC%9D%B8%EC%A6%9D%EC%9D%84+%EA%B1%B0%EB%B6%80%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4",
			);
		});

		it("storybook callback 성공 시 returnTo로 리다이렉트해야 한다", async () => {
			mockAuthApplicationService.handleOidcCallback.mockResolvedValue(
				"http://localhost:6006/?path=/story/button",
			);

			await controller.handleStorybookCallback(
				"auth-code",
				"state-value",
				undefined as unknown as string,
				undefined as unknown as string,
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"http://localhost:6006/?path=/story/button",
			);
		});

		it("storybook callback 에러는 storybook 로그인 셸로 리다이렉트해야 한다", async () => {
			await controller.handleStorybookCallback(
				undefined as unknown as string,
				undefined as unknown as string,
				"access_denied",
				"사용자가 인증을 거부했습니다",
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"http://localhost:6006/__storybook_auth/login?error=%EC%82%AC%EC%9A%A9%EC%9E%90%EA%B0%80+%EC%9D%B8%EC%A6%9D%EC%9D%84+%EA%B1%B0%EB%B6%80%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4",
			);
		});

		it("storybook callback 처리 실패 시 admin 로그인으로 가지 않아야 한다", async () => {
			mockAuthApplicationService.handleOidcCallback.mockRejectedValue(
				new UnauthorizedException("OIDC state 검증에 실패했습니다"),
			);

			await controller.handleStorybookCallback(
				"auth-code",
				"invalid-state",
				undefined as unknown as string,
				undefined as unknown as string,
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"http://localhost:6006/__storybook_auth/login?error=OIDC+%EC%9D%B8%EC%A6%9D+%EC%BD%9C%EB%B0%B1+%EC%B2%98%EB%A6%AC%EC%97%90+%EC%8B%A4%ED%8C%A8%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4",
			);
		});

		it("idpWeb callback 성공 시 기본 대시보드로 리다이렉트해야 한다", async () => {
			mockAuthApplicationService.handleOidcCallback.mockResolvedValue(
				undefined,
			);

			await controller.handleIdpCallback(
				"auth-code",
				"state-value",
				undefined as unknown as string,
				undefined as unknown as string,
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"http://localhost:3008/dashboard",
			);
		});

		it("idpWeb callback 처리 실패 시 idp 로그인으로 리다이렉트해야 한다", async () => {
			mockAuthApplicationService.handleOidcCallback.mockRejectedValue(
				new UnauthorizedException("OIDC state 검증에 실패했습니다"),
			);

			await controller.handleIdpCallback(
				"auth-code",
				"invalid-state",
				undefined as unknown as string,
				undefined as unknown as string,
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"http://localhost:3008/auth/login?error=OIDC+%EC%9D%B8%EC%A6%9D+%EC%BD%9C%EB%B0%B1+%EC%B2%98%EB%A6%AC%EC%97%90+%EC%8B%A4%ED%8C%A8%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4",
			);
		});
	});

	describe("refreshToken", () => {
		it("리프레시 토큰이 있으면 IDP에서 새 토큰을 발급해야 한다", async () => {
			mockAuthApplicationService.refreshTokenWithIdp.mockResolvedValue({
				accessToken: "new-access-token",
				refreshToken: "new-refresh-token",
				accessTokenExpiresAt: mockTokenExpiryInfo.accessTokenExpiresAt,
				refreshTokenExpiresAt: mockTokenExpiryInfo.refreshTokenExpiresAt,
				user: mockUser as never,
			});

			const result = await controller.refreshToken(
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			expect(
				mockAuthApplicationService.refreshTokenWithIdp,
			).toHaveBeenCalledWith(
				"test-refresh-token",
				"storybook.test-session-id",
				mockResponse,
			);
			expect(result.accessToken).toBe("new-access-token");
		});

		it("리프레시 토큰이 없으면 UnauthorizedException을 던져야 한다", async () => {
			const requestWithoutToken = { cookies: {} };
			mockAuthApplicationService.refreshTokenWithIdp.mockRejectedValue(
				new UnauthorizedException("리프레시 토큰이 존재하지 않습니다"),
			);

			await expect(
				controller.refreshToken(
					requestWithoutToken as unknown as never,
					mockResponse as unknown as never,
				),
			).rejects.toThrow(UnauthorizedException);
		});
	});

	describe("signUp", () => {
		it("회원가입이 성공해야 한다", async () => {
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

			const result = await controller.signUp(signUpDto);

			expect(mockAuthApplicationService.signUp).toHaveBeenCalledWith(signUpDto);
			expect(result).toEqual(signUpResult);
		});
	});

	describe("verifyToken", () => {
		it("유효한 토큰은 만료 시간 정보를 반환해야 한다", async () => {
			mockAuthApplicationService.verifyToken.mockReturnValue({
				valid: true,
				accessTokenExpiresAt: mockTokenExpiryInfo.accessTokenExpiresAt,
				refreshTokenExpiresAt: mockTokenExpiryInfo.refreshTokenExpiresAt,
				hasFullAccess: true,
			} as never);

			const result = (await controller.verifyToken()) as unknown as {
				valid: boolean;
				accessTokenExpiresAt: number;
				refreshTokenExpiresAt: number;
				hasFullAccess: boolean;
			};

			expect(mockAuthApplicationService.verifyToken).toHaveBeenCalled();
			expect(result.valid).toBe(true);
			expect(result.hasFullAccess).toBe(true);
		});

		it("Space 선택 없이 호출할 수 있도록 SkipSpaceCheck 메타데이터가 선언되어야 한다", () => {
			const metadata = Reflect.getMetadata(
				SKIP_SPACE_CHECK_KEY,
				AuthController.prototype.verifyToken,
			);

			expect(metadata).toBe(true);
		});
	});

	describe("logout", () => {
		it("액세스 토큰이 있으면 토큰을 무효화해야 한다", async () => {
			mockAuthApplicationService.logoutWithCookie.mockResolvedValue(true);

			const result = await controller.logout(
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			expect(mockAuthApplicationService.logoutWithCookie).toHaveBeenCalledWith(
				"test-access-token",
				"storybook.test-session-id",
				mockResponse,
			);
			expect(result).toBe(true);
		});
	});
});
