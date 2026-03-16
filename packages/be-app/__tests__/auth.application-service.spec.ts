import { OidcFacade } from "@cocrepo/integration";
import {
	AuthAuditLogService,
	AuthCacheService,
	EmailService,
	RoleService,
	SpaceService,
	TokenService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { Test, type TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { AuthApplicationService } from "../src/auth.application-service";

function buildAccessToken(sub: string, expOffsetSeconds = 3600): string {
	const exp = Math.floor(Date.now() / 1000) + expOffsetSeconds;
	const payload = Buffer.from(
		JSON.stringify({ sub, exp }),
	).toString("base64url");
	return `header.${payload}.signature`;
}

describe("AuthApplicationService", () => {
	let applicationService: AuthApplicationService;
	let mockUsersService: jest.Mocked<UserService>;
	let mockRolesService: jest.Mocked<RoleService>;
	let mockSpacesService: jest.Mocked<SpaceService>;
	let mockTokenService: jest.Mocked<TokenService>;
	let mockTokenStorageService: jest.Mocked<TokenStorageService>;
	let mockAuthCacheService: jest.Mocked<AuthCacheService>;
	let mockAuthAuditLogService: jest.Mocked<AuthAuditLogService>;
	let mockEmailService: jest.Mocked<EmailService>;
	let mockOidcFacade: jest.Mocked<OidcFacade>;
	let mockClsService: jest.Mocked<ClsService>;

	beforeEach(async () => {
		mockUsersService = {
			getByIdWithTenants: jest.fn(),
			findUserForAuth: jest.fn(),
			createUserForSignUp: jest.fn(),
		} as unknown as jest.Mocked<UserService>;

		mockRolesService = {
			getDefaultUserRole: jest.fn(),
		} as unknown as jest.Mocked<RoleService>;

		mockSpacesService = {
			createPersonalSpace: jest.fn(),
			findByIdsWithGround: jest.fn(),
		} as unknown as jest.Mocked<SpaceService>;

		mockTokenService = {
			setAccessTokenCookie: jest.fn(),
			setRefreshTokenCookie: jest.fn(),
			clearTokenCookies: jest.fn(),
			isTokenBlacklisted: jest.fn(),
		} as unknown as jest.Mocked<TokenService>;

		mockTokenStorageService = {
			saveOidcState: jest.fn(),
			validateAndConsumeOidcState: jest.fn(),
			isBlacklisted: jest.fn(),
			addToBlacklist: jest.fn(),
			generateSessionId: jest.fn().mockReturnValue("session-raw"),
			saveSession: jest.fn(),
			updateSession: jest.fn(),
			deleteSession: jest.fn(),
			deleteRefreshToken: jest.fn(),
			getSessionForRevocation: jest.fn(),
			getUserSessions: jest.fn(),
			deleteOtherSessions: jest.fn(),
		} as unknown as jest.Mocked<TokenStorageService>;

		mockAuthCacheService = {
			get: jest.fn(),
			set: jest.fn(),
			invalidate: jest.fn(),
		} as unknown as jest.Mocked<AuthCacheService>;

		mockAuthAuditLogService = {
			getAuditLogs: jest.fn(),
			getStats: jest.fn(),
		} as unknown as jest.Mocked<AuthAuditLogService>;

		mockEmailService = {
			sendEmail: jest.fn(),
			sendTemporaryPasswordEmail: jest.fn(),
		} as unknown as jest.Mocked<EmailService>;

		mockClsService = {
			get: jest.fn(),
		} as unknown as jest.Mocked<ClsService>;

		mockOidcFacade = {
			createAuthorizationRequest: jest.fn().mockReturnValue({
				state: "state-token",
				codeVerifier: "verifier-token",
				authorizationUrl:
					"http://localhost:3007/oidc/auth?response_type=code&code_challenge=test",
			}),
			exchangeCodeForTokens: jest.fn(),
			refreshTokens: jest.fn(),
			revokeToken: jest.fn(),
		} as unknown as jest.Mocked<OidcFacade>;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthApplicationService,
				{ provide: UserService, useValue: mockUsersService },
				{ provide: RoleService, useValue: mockRolesService },
				{ provide: SpaceService, useValue: mockSpacesService },
				{ provide: TokenService, useValue: mockTokenService },
				{ provide: TokenStorageService, useValue: mockTokenStorageService },
				{ provide: AuthCacheService, useValue: mockAuthCacheService },
				{ provide: AuthAuditLogService, useValue: mockAuthAuditLogService },
				{ provide: EmailService, useValue: mockEmailService },
				{ provide: OidcFacade, useValue: mockOidcFacade },
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		applicationService = module.get<AuthApplicationService>(
			AuthApplicationService,
		);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(applicationService).toBeDefined();
	});

	describe("getAuthorizationUrl", () => {
		it("admin RP 기준으로 state와 returnTo 컨텍스트를 저장해야 한다", async () => {
			const url = await applicationService.getAuthorizationUrl(
				"/admin/dashboard",
			);

			expect(url).toContain("/oidc/auth?");
			expect(mockOidcFacade.createAuthorizationRequest).toHaveBeenCalledWith(
				"admin",
				"/admin/dashboard",
			);
			expect(mockTokenStorageService.saveOidcState).toHaveBeenCalledWith(
				"state-token",
				"verifier-token",
				600,
				"/admin/dashboard",
				"admin",
			);
		});

		it("storybook RP 기준으로 state를 저장해야 한다", async () => {
			await applicationService.getAuthorizationUrl(
				"http://localhost:6006/?path=/story/button",
				"storybook",
			);

			expect(mockOidcFacade.createAuthorizationRequest).toHaveBeenCalledWith(
				"storybook",
				"http://localhost:6006/?path=/story/button",
			);
			expect(mockTokenStorageService.saveOidcState).toHaveBeenCalledWith(
				"state-token",
				"verifier-token",
				600,
				"http://localhost:6006/?path=/story/button",
				"storybook",
			);
		});
	});

	describe("handleOidcCallback", () => {
		it("state에 저장된 storybook clientKey로 토큰 교환과 세션 생성을 수행해야 한다", async () => {
			mockTokenStorageService.validateAndConsumeOidcState.mockResolvedValue({
				codeVerifier: "verifier-token",
				returnTo: "http://localhost:6006/?path=/story/button",
				clientKey: "storybook",
			} as never);
			mockOidcFacade.exchangeCodeForTokens.mockResolvedValue({
				access_token: buildAccessToken("user-1"),
				refresh_token: "refresh-token",
				token_type: "Bearer",
				expires_in: 3600,
			});
			mockUsersService.getByIdWithTenants.mockResolvedValue({
				id: "user-1",
				email: "test@example.com",
				name: "Test User",
				tenants: [],
			} as never);

			const req = {
				headers: { "user-agent": "test-agent" },
				ip: "127.0.0.1",
				socket: { remoteAddress: "127.0.0.1" },
			} as never;
			const res = {
				cookie: jest.fn(),
			} as unknown as never;

			const returnTo = await applicationService.handleOidcCallback(
				"auth-code",
				"state-token",
				req,
				res,
			);

			expect(mockOidcFacade.exchangeCodeForTokens).toHaveBeenCalledWith(
				"auth-code",
				"verifier-token",
				"storybook",
			);
			expect(mockTokenStorageService.saveSession).toHaveBeenCalledWith(
				"user-1",
				"storybook.session-raw",
				"refresh-token",
				expect.objectContaining({
					userAgent: "test-agent",
					ipAddress: "127.0.0.1",
					clientKey: "storybook",
				}),
			);
			expect((res as { cookie: jest.Mock }).cookie).toHaveBeenCalledWith(
				"sessionId",
				"storybook.session-raw",
				expect.any(Object),
			);
			expect(returnTo).toBe("http://localhost:6006/?path=/story/button");
		});
	});

	describe("refreshTokenWithIdp", () => {
		it("sessionId prefix에서 storybook clientKey를 복원해야 한다", async () => {
			mockOidcFacade.refreshTokens.mockResolvedValue({
				access_token: buildAccessToken("user-1"),
				refresh_token: "new-refresh-token",
				token_type: "Bearer",
				expires_in: 3600,
			});
			mockUsersService.getByIdWithTenants.mockResolvedValue({
				id: "user-1",
				email: "test@example.com",
				name: "Test User",
				tenants: [],
			} as never);

			const result = await applicationService.refreshTokenWithIdp(
				"refresh-token",
				"storybook.session-raw",
				{} as never,
			);

			expect(mockOidcFacade.refreshTokens).toHaveBeenCalledWith(
				"refresh-token",
				"storybook",
			);
			expect(mockTokenStorageService.updateSession).toHaveBeenCalledWith(
				"user-1",
				"storybook.session-raw",
				"new-refresh-token",
			);
			expect(result.refreshToken).toBe("new-refresh-token");
		});
	});

	describe("logoutWithCookie", () => {
		it("sessionId prefix 기준 RP로 revocation을 수행해야 한다", async () => {
			const accessToken = buildAccessToken("user-1", 3600);
			const res = {
				clearCookie: jest.fn(),
			} as unknown as never;

			const result = await applicationService.logoutWithCookie(
				accessToken,
				"storybook.session-raw",
				res,
			);

			expect(mockOidcFacade.revokeToken).toHaveBeenCalledWith(
				accessToken,
				"storybook",
			);
			expect(mockTokenStorageService.addToBlacklist).toHaveBeenCalledWith(
				accessToken,
				expect.any(Number),
			);
			expect(mockTokenStorageService.deleteSession).toHaveBeenCalledWith(
				"user-1",
				"storybook.session-raw",
			);
			expect(mockTokenService.clearTokenCookies).toHaveBeenCalledWith(res);
			expect((res as { clearCookie: jest.Mock }).clearCookie).toHaveBeenCalledWith(
				"sessionId",
			);
			expect(result).toBe(true);
		});
	});

	describe("verifyToken", () => {
		it("유효한 토큰의 만료 시간을 반환해야 한다", () => {
			const exp = Math.floor(Date.now() / 1000) + 3600;
			const fakeToken = `header.${Buffer.from(JSON.stringify({ sub: "user-1", exp })).toString("base64url")}.signature`;
			mockClsService.get.mockReturnValue(fakeToken);

			const result = applicationService.verifyToken();

			expect(result.valid).toBe(true);
			expect(result.accessTokenExpiresAt).toBe(exp * 1000);
		});
	});

	describe("getMySpaces", () => {
		it("사용자가 없으면 빈 배열을 반환해야 한다", async () => {
			mockClsService.get.mockReturnValue(undefined);

			const result = await applicationService.getMySpaces();

			expect(result).toEqual([]);
		});
	});
});
