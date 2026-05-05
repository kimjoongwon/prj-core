import { CONTEXT_KEYS } from "@cocrepo/constant";
import { OidcFacade } from "@cocrepo/integration";
import {
	AuthAuditLogService,
	AuthCacheService,
	EmailService,
	EmailVerificationService,
	OidcClientService,
	RoleService,
	SpaceService,
	TokenService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
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
		scope: string;
		skipConsent: boolean;
		tokenEndpointAuthMethod: string;
	}> = {},
): Awaited<ReturnType<OidcClientService["getByClientId"]>> {
	return {
		id: `${clientId}-db-id`,
		clientId,
		clientSecret:
			overrides.clientSecret === undefined
				? `${clientId}-secret`
				: overrides.clientSecret,
		name: `${clientId} app`,
		redirectUris: [
			overrides.redirectUri ||
				`http://localhost:3000/api/v1/auth/callback?clientId=${clientId}`,
		],
		loginUrl:
			overrides.loginUrl === undefined
				? `http://localhost:3000/${clientId}/login`
				: overrides.loginUrl,
		defaultReturnTo:
			overrides.defaultReturnTo === undefined
				? `http://localhost:3000/${clientId}`
				: overrides.defaultReturnTo,
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod:
			overrides.tokenEndpointAuthMethod || "client_secret_post",
		scope: overrides.scope || "openid profile email roles",
		isActive: overrides.isActive ?? true,
		skipConsent: overrides.skipConsent ?? false,
		isPublicClient: false,
		isConfidentialClient: true,
		logoUri: null,
		policyUri: null,
		tosUri: null,
		removedAt: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	} as unknown as Awaited<ReturnType<OidcClientService["getByClientId"]>>;
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
	let mockEmailVerificationService: jest.Mocked<EmailVerificationService>;
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
			sendEmailVerificationEmail: jest.fn(),
		} as unknown as jest.Mocked<EmailService>;

		mockEmailVerificationService = {
			requestVerification: jest.fn(),
			consumePendingByRawToken: jest.fn(),
			markVerified: jest.fn(),
		} as unknown as jest.Mocked<EmailVerificationService>;

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
					if (clientId === "storybook-web") {
						return buildOidcClient("storybook-web", {
							redirectUri:
								"http://localhost:6006/api/v1/auth/callback?clientId=storybook-web",
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
					if (clientId === "user-mobile") {
						return buildOidcClient("user-mobile", {
							clientSecret: null,
							redirectUri: "onora-mobile://auth/callback",
							loginUrl: "",
							defaultReturnTo: "",
							scope: "openid profile email",
							tokenEndpointAuthMethod: "none",
						});
					}
					if (clientId === "admin-web") {
						return buildOidcClient("admin-web", {
							redirectUri:
								"http://localhost:3000/api/v1/auth/callback?clientId=admin-web",
							loginUrl: "http://localhost:3000/admin/auth/login",
							defaultReturnTo: "http://localhost:3000/admin/dashboard",
						});
					}
					if (clientId === "swagger-web") {
						return buildOidcClient("swagger-web", {
							redirectUri: "http://localhost:3007/api/oauth2-redirect.html",
							loginUrl: "http://localhost:3007/api",
							defaultReturnTo: "http://localhost:3007/api",
						});
					}
					throw new NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
				}),
			getByClientId: jest.fn().mockImplementation(async (clientId: string) => {
				if (clientId === "storybook-web") {
					return buildOidcClient("storybook-web", {
						redirectUri:
							"http://localhost:6006/api/v1/auth/callback?clientId=storybook-web",
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
				if (clientId === "user-mobile") {
					return buildOidcClient("user-mobile", {
						clientSecret: null,
						redirectUri: "onora-mobile://auth/callback",
						loginUrl: "",
						defaultReturnTo: "",
						scope: "openid profile email",
						tokenEndpointAuthMethod: "none",
					});
				}
				if (clientId === "admin-web") {
					return buildOidcClient("admin-web", {
						redirectUri:
							"http://localhost:3000/api/v1/auth/callback?clientId=admin-web",
						loginUrl: "http://localhost:3000/admin/auth/login",
						defaultReturnTo: "http://localhost:3000/admin/dashboard",
					});
				}
				if (clientId === "swagger-web") {
					return buildOidcClient("swagger-web", {
						redirectUri: "http://localhost:3007/api/oauth2-redirect.html",
						loginUrl: "http://localhost:3007/api",
						defaultReturnTo: "http://localhost:3007/api",
					});
				}
				throw new NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
			}),
		} as unknown as jest.Mocked<OidcClientService>;

		applicationService = new AuthApplicationService(
			mockUsersService,
			mockRolesService,
			mockSpacesService,
			mockTokenService,
			mockTokenStorageService,
			mockAuthCacheService,
			mockAuthAuditLogService,
			mockEmailService,
			mockEmailVerificationService,
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
			expect(mockOidcClientService.getByClientId).toHaveBeenCalledWith(
				"admin-web",
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

			expect(mockOidcClientService.getByClientId).toHaveBeenCalledWith(
				"idp-web",
			);
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

		it("user-mobile clientId는 auth shell 없이 native redirect URI로 authorization request를 생성해야 한다", async () => {
			await applicationService.getAuthorizationUrl("/", "user-mobile");

			expect(mockOidcClientService.getByClientId).toHaveBeenCalledWith(
				"user-mobile",
			);
			expect(mockOidcFacade.createAuthorizationRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					clientId: "user-mobile",
					clientSecret: null,
					redirectUri: "onora-mobile://auth/callback",
					scope: "openid profile email",
				}),
				"/",
			);
			expect(mockTokenStorageService.saveOidcState).toHaveBeenCalledWith(
				"state-token",
				"verifier-token",
				600,
				"/",
				"user-mobile",
			);
		});

		it("legacy storybook clientId를 canonical storybook-web으로 정규화해야 한다", async () => {
			await applicationService.getAuthorizationUrl(
				"http://localhost:6006/",
				"storybook",
			);

			expect(mockOidcFacade.createAuthorizationRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					clientId: "storybook-web",
					redirectUri:
						"http://localhost:6006/api/v1/auth/callback?clientId=storybook-web",
				}),
				"http://localhost:6006/",
			);
			expect(mockTokenStorageService.saveOidcState).toHaveBeenCalledWith(
				"state-token",
				"verifier-token",
				600,
				"http://localhost:6006/",
				"storybook-web",
			);
		});

		it("canonical swagger-web 요청도 migration 전 legacy DB client로 fallback 해야 한다", async () => {
			mockOidcClientService.getByClientId.mockImplementation(
				async (clientId: string) => {
					if (clientId === "swagger-web") {
						throw new NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
					}

					if (clientId === "prj-core-swagger") {
						return buildOidcClient("prj-core-swagger", {
							redirectUri: "http://localhost:3007/api/oauth2-redirect.html",
							loginUrl: "http://localhost:3007/api",
							defaultReturnTo: "http://localhost:3007/api",
						});
					}

					throw new NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
				},
			);

			await applicationService.getAuthorizationUrl(
				"http://localhost:3007/api",
				"swagger-web",
			);

			expect(mockOidcFacade.createAuthorizationRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					clientId: "prj-core-swagger",
					redirectUri: "http://localhost:3007/api/oauth2-redirect.html",
				}),
				"http://localhost:3007/api",
			);
			expect(mockTokenStorageService.saveOidcState).toHaveBeenCalledWith(
				"state-token",
				"verifier-token",
				600,
				"http://localhost:3007/api",
				"prj-core-swagger",
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

			expect(mockOidcClientService.getByClientId).toHaveBeenCalledWith(
				"idp-web",
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

		it("user-mobile 콜백은 native client로 토큰을 교환하고 user-mobile 세션을 생성해야 한다", async () => {
			mockTokenStorageService.validateAndConsumeOidcState.mockResolvedValue({
				codeVerifier: "verifier-token",
				returnTo: "onora-mobile://auth/callback?returnTo=/",
				clientId: "user-mobile",
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

			expect(mockOidcClientService.getByClientId).toHaveBeenCalledWith(
				"user-mobile",
			);
			expect(mockOidcFacade.exchangeCodeForTokens).toHaveBeenCalledWith(
				"auth-code",
				"verifier-token",
				expect.objectContaining({
					clientId: "user-mobile",
					clientSecret: null,
					redirectUri: "onora-mobile://auth/callback",
					scope: "openid profile email",
				}),
			);
			expect(mockTokenStorageService.saveSession).toHaveBeenCalledWith(
				"user-1",
				"user-mobile.session-raw",
				"refresh-token",
				expect.objectContaining({
					clientId: "user-mobile",
				}),
			);
			expect(result).toEqual({
				returnTo: "onora-mobile://auth/callback?returnTo=/",
				defaultReturnTo: "/",
				loginUrl: "",
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
		it("유효한 토큰의 만료 시간과 현재 tenant의 FULL_ACCESS 여부를 반환해야 한다", async () => {
			const exp = Math.floor(Date.now() / 1000) + 3600;
			const fakeToken = `header.${Buffer.from(
				JSON.stringify({ sub: "user-1", exp }),
			).toString("base64url")}.signature`;
			mockClsService.get.mockImplementation((key) => {
				if (key === CONTEXT_KEYS.TOKEN) {
					return fakeToken;
				}

				if (key === CONTEXT_KEYS.TENANT) {
					return {
						id: "tenant-1",
						spaceId: "space-1",
						role: { name: "FULL_ACCESS" },
					};
				}

				return undefined;
			});

			const result = await applicationService.verifyToken();

			expect(result.valid).toBe(true);
			expect(result.accessTokenExpiresAt).toBe(exp * 1000);
			expect(result.hasFullAccess).toBe(true);
		});

		it("다른 tenant에 FULL_ACCESS가 있어도 현재 tenant가 아니면 hasFullAccess를 false로 반환해야 한다", async () => {
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
								spaceId: "space-1",
								role: { name: "FULL_ACCESS" },
							},
						],
					};
				}

				if (key === CONTEXT_KEYS.TENANT) {
					return {
						id: "tenant-2",
						spaceId: "space-2",
						role: { name: "VIEW" },
					};
				}

				return undefined;
			});

			const result = await applicationService.verifyToken();

			expect(result.hasFullAccess).toBe(false);
		});

		it("x-space-id가 있는데 현재 tenant를 찾지 못하면 ForbiddenException을 던져야 한다", async () => {
			const exp = Math.floor(Date.now() / 1000) + 3600;
			const fakeToken = `header.${Buffer.from(
				JSON.stringify({ sub: "user-1", exp }),
			).toString("base64url")}.signature`;
			mockClsService.get.mockImplementation((key) => {
				if (key === CONTEXT_KEYS.TOKEN) {
					return fakeToken;
				}

				if (key === CONTEXT_KEYS.SPACE_ID) {
					return "missing-space";
				}

				return undefined;
			});

			await expect(applicationService.verifyToken()).rejects.toThrow(
				ForbiddenException,
			);
		});
	});

	describe("signUp email verification", () => {
		it("회원가입 요청은 User를 즉시 만들지 않고 이메일 인증 요청을 생성해야 한다", async () => {
			const expiresAt = new Date("2026-04-29T09:30:00.000Z");
			mockUsersService.findUserForAuth.mockResolvedValue(null);
			mockEmailVerificationService.requestVerification.mockResolvedValue({
				email: "new@example.com",
				expiresAt,
			});

			const result = await applicationService.signUp({
				name: "New User",
				nickname: "newbie",
				email: "new@example.com",
				phone: "010-0000-0000",
				password: "Password123!",
			});

			expect(result).toEqual({
				email: "new@example.com",
				expiresAt,
			});
			expect(mockUsersService.createUserForSignUp).not.toHaveBeenCalled();
			expect(
				mockEmailVerificationService.requestVerification,
			).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "New User",
					nickname: "newbie",
					email: "new@example.com",
					phone: "010-0000-0000",
					passwordHash: expect.any(String),
				}),
			);
		});

		it("이메일 인증 성공 시 기존 회원가입 방식으로 User와 개인 Space를 생성해야 한다", async () => {
			mockEmailVerificationService.consumePendingByRawToken.mockResolvedValue({
				id: "verification-1",
				email: "new@example.com",
				name: "New User",
				nickname: "newbie",
				phone: "010-0000-0000",
				passwordHash: "hashed-password",
			} as never);
			mockUsersService.findUserForAuth.mockResolvedValue(null);
			mockRolesService.getDefaultUserRole.mockResolvedValue({
				id: "role-user",
			} as never);
			mockSpacesService.createPersonalSpace.mockResolvedValue({
				id: "space-personal",
			} as never);
			mockUsersService.createUserForSignUp.mockResolvedValue({
				id: "user-new",
			} as never);

			const redirectUrl =
				await applicationService.confirmEmailVerification("raw-token");

			expect(redirectUrl).toBe("http://localhost:3000/admin/auth/login");
			expect(mockUsersService.createUserForSignUp).toHaveBeenCalledWith({
				name: "New User",
				email: "new@example.com",
				phone: "010-0000-0000",
				password: "hashed-password",
				spaceId: "space-personal",
				roleId: "role-user",
				nickname: "newbie",
			});
			expect(mockEmailVerificationService.markVerified).toHaveBeenCalledWith(
				"verification-1",
				"user-new",
			);
		});
	});

	describe("current space helpers", () => {
		const fullAccessUser = {
			id: "user-1",
			email: "test@example.com",
			name: "Test User",
			tenants: [
				{
					id: "tenant-space-1",
					spaceId: "space-1",
					role: { name: "VIEW" },
				},
				{
					id: "tenant-space-2",
					spaceId: "space-2",
					role: { name: "FULL_ACCESS" },
				},
			],
		};

		beforeEach(() => {
			mockClsService.get.mockReset();
			mockSpacesService.findByIdsWithGround.mockReset();
			mockSpacesService.findByIdsWithGround.mockResolvedValue([
				{
					id: "space-1",
					ground: { name: "Space One" },
				},
				{
					id: "space-2",
					ground: { name: "Space Two" },
				},
			] as never);
		});

		it("x-space-id가 접근 가능한 Space면 그대로 반환해야 한다", async () => {
			mockClsService.get.mockImplementation((key) => {
				if (key === CONTEXT_KEYS.AUTH_USER) {
					return fullAccessUser as never;
				}

				return undefined;
			});

			const result = await applicationService.getCurrentSpace("space-1");

			expect(result?.id).toBe("space-1");
		});

		it("x-space-id가 없거나 접근 불가하면 접근 가능한 기본 순서의 Space를 반환해야 한다", async () => {
			mockClsService.get.mockImplementation((key) => {
				if (key === CONTEXT_KEYS.AUTH_USER) {
					return fullAccessUser as never;
				}

				return undefined;
			});

			const result = await applicationService.getCurrentSpace("unknown-space");

			expect(result?.id).toBe("space-1");
		});

		it("setCurrentSpace는 쿠키 없이 접근 가능한 Space DTO만 반환해야 한다", async () => {
			mockClsService.get.mockImplementation((key) => {
				if (key === CONTEXT_KEYS.AUTH_USER) {
					return fullAccessUser as never;
				}

				return undefined;
			});

			const result = await applicationService.setCurrentSpace({
				spaceId: "space-1",
			} as never);

			expect(result.id).toBe("space-1");
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
