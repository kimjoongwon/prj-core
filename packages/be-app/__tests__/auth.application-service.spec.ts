import { CONTEXT_KEYS } from "@cocrepo/constant";
import { OidcFacade } from "@cocrepo/integration";
import {
	AbilityService,
	AuthAuditLogService,
	AuthCacheService,
	EmailService,
	OidcClientService,
	RoleService,
	SpaceService,
	TokenService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { ClsService } from "nestjs-cls";
import { AuthApplicationService } from "../src/auth.application-service";

function buildAccessToken(sub: string, expOffsetSeconds = 3600): string {
	const exp = Math.floor(Date.now() / 1000) + expOffsetSeconds;
	const payload = Buffer.from(JSON.stringify({ sub, exp })).toString(
		"base64url",
	);
	return `header.${payload}.signature`;
}

function buildOidcClient(
	clientId: string,
	overrides: Partial<{
		clientSecret: string | null;
		redirectUri: string;
		loginUrl: string;
		defaultReturnTo: string;
		isActive: boolean;
	}> = {},
) {
	return {
		id: `${clientId}-db-id`,
		clientId,
		clientSecret: `${clientId}-secret`,
		name: `${clientId} app`,
		redirectUris: [
			overrides.redirectUri ||
				`http://localhost:3000/api/v1/auth/callback?clientId=${clientId}`,
		],
		loginUrl: overrides.loginUrl || `http://localhost:3000/${clientId}/login`,
		defaultReturnTo:
			overrides.defaultReturnTo || `http://localhost:3000/${clientId}`,
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "client_secret_post",
		scope: "openid profile email roles",
		isActive: overrides.isActive ?? true,
		logoUri: null,
		policyUri: null,
		tosUri: null,
		removedAt: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

describe("AuthApplicationService", () => {
	let applicationService: AuthApplicationService;
	let mockUsersService: jest.Mocked<UserService>;
	let mockRolesService: jest.Mocked<RoleService>;
	let mockAbilitiesService: jest.Mocked<AbilityService>;
	let mockSpacesService: jest.Mocked<SpaceService>;
	let mockTokenService: jest.Mocked<TokenService>;
	let mockTokenStorageService: jest.Mocked<TokenStorageService>;
	let mockAuthCacheService: jest.Mocked<AuthCacheService>;
	let mockAuthAuditLogService: jest.Mocked<AuthAuditLogService>;
	let mockEmailService: jest.Mocked<EmailService>;
	let mockOidcFacade: jest.Mocked<OidcFacade>;
	let mockOidcClientService: jest.Mocked<OidcClientService>;
	let mockClsService: jest.Mocked<ClsService>;

	beforeEach(async () => {
		mockUsersService = {
			getByIdWithTenants: jest.fn(),
			findUserForAuth: jest.fn(),
			createUserForSignUp: jest.fn(),
			changePassword: jest.fn(),
			unlockAccount: jest.fn(),
			forceResetPassword: jest.fn(),
			getSecurityInfo: jest.fn(),
		} as unknown as jest.Mocked<UserService>;

		mockRolesService = {
			getDefaultUserRole: jest.fn(),
		} as unknown as jest.Mocked<RoleService>;

		mockAbilitiesService = {
			getMergedAbilities: jest.fn(),
			getRoleAbilities: jest.fn().mockResolvedValue([]),
		} as unknown as jest.Mocked<AbilityService>;

		mockSpacesService = {
			createPersonalSpace: jest.fn(),
			findByIdsWithGround: jest.fn(),
		} as unknown as jest.Mocked<SpaceService>;

		mockTokenService = {
			setAccessTokenCookie: jest.fn(),
			setRefreshTokenCookie: jest.fn(),
			setSelectedSpaceCookie: jest.fn(),
			clearTokenCookies: jest.fn(),
			clearSelectedSpaceCookie: jest.fn(),
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
			createAuthorizationRequest: jest.fn().mockImplementation((client) => ({
				state: "state-token",
				codeVerifier: "verifier-token",
				authorizationUrl: `http://localhost:3007/oidc/auth?client_id=${client.clientId}`,
			})),
			exchangeCodeForTokens: jest.fn(),
			refreshTokens: jest.fn(),
			revokeToken: jest.fn(),
		} as unknown as jest.Mocked<OidcFacade>;

		mockOidcClientService = {
			getAuthShellClientByClientId: jest
				.fn()
				.mockImplementation(async ({ clientId }) => {
					if (clientId === "storybook") {
						return buildOidcClient("storybook", {
							redirectUri:
								"http://localhost:6006/api/v1/auth/callback?clientId=storybook",
							loginUrl: "http://localhost:6006/__storybook_auth/login",
							defaultReturnTo: "http://localhost:6006/",
						});
					}
					if (clientId === "idp-web") {
						return buildOidcClient("idp-web", {
							redirectUri:
								"http://localhost:3008/api/v1/auth/callback?clientId=idp-web",
							loginUrl: "http://localhost:3008/auth/login",
							defaultReturnTo: "http://localhost:3008/dashboard",
						});
					}
					return buildOidcClient("admin-web", {
						redirectUri:
							"http://localhost:3000/api/v1/auth/callback?clientId=admin-web",
						loginUrl: "http://localhost:3000/admin/auth/login",
						defaultReturnTo: "http://localhost:3000/admin/dashboard",
					});
				}),
			getByClientId: jest.fn().mockImplementation(async (clientId: string) => {
				if (clientId === "storybook") {
					return buildOidcClient("storybook", {
						redirectUri:
							"http://localhost:6006/api/v1/auth/callback?clientId=storybook",
						loginUrl: "http://localhost:6006/__storybook_auth/login",
						defaultReturnTo: "http://localhost:6006/",
					});
				}
				if (clientId === "idp-web") {
					return buildOidcClient("idp-web", {
						redirectUri:
							"http://localhost:3008/api/v1/auth/callback?clientId=idp-web",
						loginUrl: "http://localhost:3008/auth/login",
						defaultReturnTo: "http://localhost:3008/dashboard",
					});
				}
				return buildOidcClient("admin-web", {
					redirectUri:
						"http://localhost:3000/api/v1/auth/callback?clientId=admin-web",
					loginUrl: "http://localhost:3000/admin/auth/login",
					defaultReturnTo: "http://localhost:3000/admin/dashboard",
				});
			}),
		} as unknown as jest.Mocked<OidcClientService>;

		applicationService = new AuthApplicationService(
			mockUsersService,
			mockRolesService,
			mockAbilitiesService,
			mockSpacesService,
			mockTokenService,
			mockTokenStorageService,
			mockAuthCacheService,
			mockAuthAuditLogService,
			mockEmailService,
			mockOidcClientService,
			mockOidcFacade,
			mockClsService,
		);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(applicationService).toBeDefined();
	});

	describe("getAuthorizationUrl", () => {
		it("기본 admin-web client 기준으로 state와 returnTo 컨텍스트를 저장해야 한다", async () => {
			const url =
				await applicationService.getAuthorizationUrl("/admin/dashboard");

			expect(url).toContain("/oidc/auth?");
			expect(
				mockOidcClientService.getAuthShellClientByClientId,
			).toHaveBeenCalledWith(
				expect.objectContaining({ clientId: "admin-web" }),
			);
			expect(mockOidcFacade.createAuthorizationRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					clientId: "admin-web",
					redirectUri:
						"http://localhost:3000/api/v1/auth/callback?clientId=admin-web",
				}),
				"/admin/dashboard",
			);
			expect(mockTokenStorageService.saveOidcState).toHaveBeenCalledWith(
				"state-token",
				"verifier-token",
				600,
				"/admin/dashboard",
				"admin-web",
			);
		});

		it("idp-web clientId로 별도 authorization request를 생성해야 한다", async () => {
			await applicationService.getAuthorizationUrl(
				"http://localhost:3008/dashboard",
				"idp-web",
			);

			expect(
				mockOidcClientService.getAuthShellClientByClientId,
			).toHaveBeenCalledWith(expect.objectContaining({ clientId: "idp-web" }));
			expect(mockOidcFacade.createAuthorizationRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					clientId: "idp-web",
					redirectUri:
						"http://localhost:3008/api/v1/auth/callback?clientId=idp-web",
				}),
				"http://localhost:3008/dashboard",
			);
			expect(mockTokenStorageService.saveOidcState).toHaveBeenCalledWith(
				"state-token",
				"verifier-token",
				600,
				"http://localhost:3008/dashboard",
				"idp-web",
			);
		});
	});

	describe("handleOidcCallback", () => {
		it("state에 저장된 clientId로 토큰 교환과 세션 생성을 수행해야 한다", async () => {
			mockTokenStorageService.validateAndConsumeOidcState.mockResolvedValue({
				codeVerifier: "verifier-token",
				returnTo: "http://localhost:3008/dashboard",
				clientId: "idp-web",
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

			const result = await applicationService.handleOidcCallback(
				"auth-code",
				"state-token",
				req,
				res,
			);

			expect(
				mockOidcClientService.getAuthShellClientByClientId,
			).toHaveBeenCalledWith(
				expect.objectContaining({
					clientId: "idp-web",
					requireActive: false,
				}),
			);
			expect(mockOidcFacade.exchangeCodeForTokens).toHaveBeenCalledWith(
				"auth-code",
				"verifier-token",
				expect.objectContaining({
					clientId: "idp-web",
					redirectUri:
						"http://localhost:3008/api/v1/auth/callback?clientId=idp-web",
				}),
			);
			expect(mockTokenStorageService.saveSession).toHaveBeenCalledWith(
				"user-1",
				"idp-web.session-raw",
				"refresh-token",
				expect.objectContaining({
					userAgent: "test-agent",
					ipAddress: "127.0.0.1",
					clientId: "idp-web",
				}),
			);
			expect((res as { cookie: jest.Mock }).cookie).toHaveBeenCalledWith(
				"sessionId",
				"idp-web.session-raw",
				expect.any(Object),
			);
			expect(result).toEqual({
				returnTo: "http://localhost:3008/dashboard",
				defaultReturnTo: "http://localhost:3008/dashboard",
				loginUrl: "http://localhost:3008/auth/login",
			});
		});
	});

	describe("refreshTokenWithIdp", () => {
		it("sessionId prefix에서 clientId를 복원해야 한다", async () => {
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
				"idp-web.session-raw",
				undefined,
				{} as never,
			);

			expect(mockOidcClientService.getByClientId).toHaveBeenCalledWith(
				"idp-web",
			);
			expect(mockOidcFacade.refreshTokens).toHaveBeenCalledWith(
				"refresh-token",
				expect.objectContaining({
					clientId: "idp-web",
					redirectUri:
						"http://localhost:3008/api/v1/auth/callback?clientId=idp-web",
				}),
			);
			expect(mockTokenStorageService.updateSession).toHaveBeenCalledWith(
				"user-1",
				"idp-web.session-raw",
				"new-refresh-token",
			);
			expect(result.refreshToken).toBe("new-refresh-token");
		});
	});

	describe("logoutWithCookie", () => {
		it("sessionId prefix 기준 clientId로 revocation을 수행해야 한다", async () => {
			const accessToken = buildAccessToken("user-1", 3600);
			const res = {
				clearCookie: jest.fn(),
			} as unknown as never;

			const result = await applicationService.logoutWithCookie(
				accessToken,
				"idp-web.session-raw",
				res,
			);

			expect(mockOidcClientService.getByClientId).toHaveBeenCalledWith(
				"idp-web",
			);
			expect(mockOidcFacade.revokeToken).toHaveBeenCalledWith(
				accessToken,
				expect.objectContaining({
					clientId: "idp-web",
					clientSecret: "idp-web-secret",
				}),
			);
			expect(mockTokenStorageService.addToBlacklist).toHaveBeenCalledWith(
				accessToken,
				expect.any(Number),
			);
			expect(mockTokenStorageService.deleteSession).toHaveBeenCalledWith(
				"user-1",
				"idp-web.session-raw",
			);
			expect(mockTokenService.clearTokenCookies).toHaveBeenCalledWith(res);
			expect(
				(res as { clearCookie: jest.Mock }).clearCookie,
			).toHaveBeenCalledWith("sessionId");
			expect(result).toBe(true);
		});
	});

	describe("verifyToken", () => {
		it("유효한 토큰의 만료 시간과 manage all 전역 권한 여부를 반환해야 한다", async () => {
			const exp = Math.floor(Date.now() / 1000) + 3600;
			const fakeToken = `header.${Buffer.from(
				JSON.stringify({ sub: "user-1", exp }),
			).toString("base64url")}.signature`;
			mockClsService.get.mockImplementation((key) => {
				if (key === CONTEXT_KEYS.TOKEN) {
					return fakeToken;
				}

				if (key === CONTEXT_KEYS.AUTH_USER) {
					return {
						id: "user-1",
						tenants: [
							{
								id: "tenant-1",
								roleId: "role-1",
								spaceId: "space-1",
							},
						],
					};
				}

				return undefined;
			});
			mockAbilitiesService.getMergedAbilities.mockResolvedValue([
				{
					inverted: false,
					action: { name: "manage" },
					subject: { name: "all" },
				},
			] as never);

			const result = await applicationService.verifyToken();

			expect(result.valid).toBe(true);
			expect(result.accessTokenExpiresAt).toBe(exp * 1000);
			expect(result.hasFullAccess).toBe(true);
			expect(mockAbilitiesService.getMergedAbilities).toHaveBeenCalledWith(
				["role-1"],
				"user-1",
			);
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
