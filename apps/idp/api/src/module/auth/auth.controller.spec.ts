import { AuthApplicationService } from "@cocrepo/app";
import { REQUEST_HEADER_KEYS } from "@cocrepo/constant";
import { SKIP_SPACE_CHECK_KEY } from "@cocrepo/decorator";
import type { SignUpPayloadDto } from "@cocrepo/dto";
import { HttpStatus, UnauthorizedException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
	let controller: AuthController;
	let mockAuthApplicationService: jest.Mocked<AuthApplicationService>;

	const mockTokenExpiryInfo = {
		accessTokenExpiresAt: Date.now() + 60 * 60 * 1000,
		refreshTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
	};

	const mockUser = {
		id: "user-test-id",
		email: "test@example.com",
		name: "Test User",
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
		status: jest.fn().mockReturnThis(),
		send: jest.fn().mockReturnThis(),
	};

	const mockRequest = {
		cookies: {
			accessToken: "test-access-token",
			refreshToken: "test-refresh-token",
			sessionId: "idp-web.test-session-id",
		},
		headers: {
			"user-agent": "test-agent",
			[REQUEST_HEADER_KEYS.SPACE_ID]: "space-test-id",
		},
		user: mockUser,
		ip: "127.0.0.1",
		socket: { remoteAddress: "127.0.0.1" },
	};

	beforeEach(async () => {
		mockAuthApplicationService = {
			getAuthorizationUrl: jest.fn(),
			getClientRedirects: jest.fn().mockImplementation(async (clientId) => {
				switch (clientId) {
					case "storybook-web":
						return {
							loginUrl: "http://localhost:6006/__storybook_auth/login",
							defaultReturnTo: "http://localhost:6006/",
							hasAuthShell: true,
						};
					case "idp-web":
						return {
							loginUrl: "http://localhost:3008/auth/login",
							defaultReturnTo: "http://localhost:3008/dashboard",
							hasAuthShell: true,
						};
					case "user-mobile":
						return {
							loginUrl: null,
							defaultReturnTo: null,
							hasAuthShell: false,
						};
					default:
						return {
							loginUrl: "http://localhost:3000/admin/auth/login",
							defaultReturnTo: "http://localhost:3000/admin/dashboard",
							hasAuthShell: true,
						};
				}
			}),
			handleOidcCallback: jest.fn(),
			refreshTokenWithIdp: jest.fn(),
			signUp: jest.fn(),
			confirmEmailVerification: jest.fn(),
			verifyToken: jest.fn(),
			logoutWithCookie: jest.fn(),
			getMySpaces: jest.fn(),
			getCurrentSpace: jest.fn(),
			setCurrentSpace: jest.fn(),
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

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthApplicationService,
					useValue: mockAuthApplicationService,
				},
			],
			}).compile();

			controller = module.get<AuthController>(AuthController);
			jest.clearAllMocks();
			mockResponse.cookie.mockReturnValue(mockResponse);
			mockResponse.clearCookie.mockReturnValue(mockResponse);
			mockResponse.redirect.mockReturnValue(mockResponse);
			mockResponse.status.mockReturnValue(mockResponse);
			mockResponse.send.mockReturnValue(mockResponse);
		});

	it("컨트롤러가 정의되어야 한다", () => {
		expect(controller).toBeDefined();
	});

	describe("login", () => {
		it("admin-web clientId 기준 authorization URL로 리다이렉트해야 한다", async () => {
			mockAuthApplicationService.getAuthorizationUrl.mockResolvedValue(
				"https://idp.example.com/oidc/auth?client_id=admin-web",
			);

			await controller.login(
				"admin-web",
				"/admin/dashboard",
				mockResponse as unknown as never,
			);

			expect(
				mockAuthApplicationService.getAuthorizationUrl,
			).toHaveBeenCalledWith("/admin/dashboard", "admin-web");
			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"https://idp.example.com/oidc/auth?client_id=admin-web",
			);
		});

		it("idp-web clientId로도 동일한 login flow를 사용해야 한다", async () => {
			mockAuthApplicationService.getAuthorizationUrl.mockResolvedValue(
				"https://idp.example.com/oidc/auth?client_id=idp-web",
			);

			await controller.login(
				"idp-web",
				"http://localhost:3008/dashboard",
				mockResponse as unknown as never,
			);

			expect(
				mockAuthApplicationService.getAuthorizationUrl,
			).toHaveBeenCalledWith("http://localhost:3008/dashboard", "idp-web");
			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"https://idp.example.com/oidc/auth?client_id=idp-web",
			);
		});

		it("user-mobile clientId로 모바일 native authorization URL을 리다이렉트해야 한다", async () => {
			mockAuthApplicationService.getAuthorizationUrl.mockResolvedValue(
				"https://idp.example.com/oidc/auth?client_id=user-mobile",
			);

			await controller.login(
				"user-mobile",
				"kr.co.cocdev.onoramobile://auth/callback?returnTo=/",
				mockResponse as unknown as never,
			);

			expect(
				mockAuthApplicationService.getAuthorizationUrl,
			).toHaveBeenCalledWith(
				"kr.co.cocdev.onoramobile://auth/callback?returnTo=/",
				"user-mobile",
			);
			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"https://idp.example.com/oidc/auth?client_id=user-mobile",
			);
		});
	});

	describe("handleCallback", () => {
		it("성공 시 returnTo를 우선 리다이렉트해야 한다", async () => {
			mockAuthApplicationService.handleOidcCallback.mockResolvedValue({
				returnTo: "http://localhost:3008/custom",
				defaultReturnTo: "http://localhost:3008/dashboard",
				loginUrl: "http://localhost:3008/auth/login",
			} as never);

			await controller.handleCallback(
				"idp-web",
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
				"http://localhost:3008/custom",
			);
		});

		it("returnTo가 없으면 defaultReturnTo로 리다이렉트해야 한다", async () => {
			mockAuthApplicationService.handleOidcCallback.mockResolvedValue({
				returnTo: undefined,
				defaultReturnTo: "http://localhost:3000/admin/dashboard",
				loginUrl: "http://localhost:3000/admin/auth/login",
			} as never);

			await controller.handleCallback(
				"admin-web",
				"auth-code",
				"state-value",
				undefined as unknown as string,
				undefined as unknown as string,
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			expect(mockResponse.redirect).toHaveBeenCalledWith(
				"http://localhost:3000/admin/dashboard",
			);
		});

		it("OIDC 에러는 clientId에 맞는 loginUrl로 리다이렉트해야 한다", async () => {
			await controller.handleCallback(
				"storybook-web",
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
				"http://localhost:6006/__storybook_auth/login?error=%EC%82%AC%EC%9A%A9%EC%9E%90%EA%B0%80+%EC%9D%B8%EC%A6%9D%EC%9D%84+%EA%B1%B0%EB%B6%80%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4",
			);
		});

		it("콜백 처리 실패 시 generic loginUrl로 복귀해야 한다", async () => {
			mockAuthApplicationService.handleOidcCallback.mockRejectedValue(
				new UnauthorizedException("OIDC state 검증에 실패했습니다"),
			);

			await controller.handleCallback(
				"idp-web",
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

		it("모바일 콜백 처리 실패는 idp-web으로 보내지 않고 오류 응답을 반환해야 한다", async () => {
			mockAuthApplicationService.handleOidcCallback.mockRejectedValue(
				new UnauthorizedException("OIDC state 검증에 실패했습니다"),
			);

			await controller.handleCallback(
				"user-mobile",
				"auth-code",
				"invalid-state",
				undefined as unknown as string,
				undefined as unknown as string,
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			expect(mockResponse.redirect).not.toHaveBeenCalledWith(
				expect.stringContaining("http://localhost:3008/auth/login"),
			);
			expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
			expect(mockResponse.send).toHaveBeenCalledWith(
				"OIDC 인증 콜백 처리에 실패했습니다",
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
				"idp-web.test-session-id",
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
		it("회원가입 이메일 인증 요청이 성공해야 한다", async () => {
			const signUpDto: SignUpPayloadDto = {
				email: "new@example.com",
				password: "password123",
				name: "New User",
			} as never;
			const signUpResult = {
				email: "new@example.com",
				expiresAt: new Date("2026-04-29T09:30:00.000Z"),
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
				"idp-web.test-session-id",
				mockResponse,
			);
			expect(result).toBe(true);
		});
	});

	describe("current space", () => {
		it("현재 선택 Space 조회 시 x-space-id 헤더 값을 전달해야 한다", async () => {
			mockAuthApplicationService.getCurrentSpace.mockResolvedValue({
				id: "space-test-id",
			} as never);

			await controller.getCurrentSpace(mockRequest as unknown as never);

			expect(mockAuthApplicationService.getCurrentSpace).toHaveBeenCalledWith(
				mockRequest.headers[REQUEST_HEADER_KEYS.SPACE_ID],
			);
		});

		it("현재 선택 Space 변경 시 body만 전달해야 한다", async () => {
			mockAuthApplicationService.setCurrentSpace.mockResolvedValue({
				id: "space-test-id",
			} as never);

			await controller.setCurrentSpace({ spaceId: "space-test-id" } as never);

			expect(mockAuthApplicationService.setCurrentSpace).toHaveBeenCalledWith({
				spaceId: "space-test-id",
			});
		});
	});
});
