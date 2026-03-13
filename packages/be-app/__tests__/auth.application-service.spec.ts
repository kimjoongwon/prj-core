import { OidcFacade } from "@cocrepo/integration";
import {
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

describe("AuthApplicationService", () => {
	let applicationService: AuthApplicationService;
	let mockUsersService: jest.Mocked<UserService>;
	let mockRolesService: jest.Mocked<RoleService>;
	let mockSpacesService: jest.Mocked<SpaceService>;
	let mockTokenService: jest.Mocked<TokenService>;
	let mockTokenStorageService: jest.Mocked<TokenStorageService>;
	let mockAuthCacheService: jest.Mocked<AuthCacheService>;
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
		} as unknown as jest.Mocked<TokenStorageService>;

		mockAuthCacheService = {
			get: jest.fn(),
			set: jest.fn(),
			invalidate: jest.fn(),
		} as unknown as jest.Mocked<AuthCacheService>;
		mockEmailService = {
			sendEmail: jest.fn(),
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
		it("PKCE code_challenge와 state를 포함한 URL을 생성해야 한다", async () => {
			// When
			const url = await applicationService.getAuthorizationUrl();

			// Then
			expect(url).toContain("/oidc/auth?");
			expect(mockOidcFacade.createAuthorizationRequest).toHaveBeenCalledWith(
				undefined,
			);
			expect(mockTokenStorageService.saveOidcState).toHaveBeenCalledWith(
				"state-token",
				"verifier-token",
				600,
				undefined,
			);
		});
	});

	describe("verifyToken", () => {
		it("유효한 토큰의 만료 시간을 반환해야 한다", () => {
			// Given
			const exp = Math.floor(Date.now() / 1000) + 3600;
			const fakeToken = `header.${Buffer.from(JSON.stringify({ sub: "user-1", exp })).toString("base64url")}.signature`;
			mockClsService.get.mockReturnValue(fakeToken);

			// When
			const result = applicationService.verifyToken();

			// Then
			expect(result.valid).toBe(true);
			expect(result.accessTokenExpiresAt).toBe(exp * 1000);
		});
	});

	describe("getMySpaces", () => {
		it("사용자가 없으면 빈 배열을 반환해야 한다", async () => {
			// Given
			mockClsService.get.mockReturnValue(undefined);

			// When
			const result = await applicationService.getMySpaces();

			// Then
			expect(result).toEqual([]);
		});
	});
});
