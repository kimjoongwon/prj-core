import {
	AuthCacheService,
	EmailService,
	RolesService,
	SpacesService,
	TokenService,
	TokenStorageService,
	UsersService,
} from "@cocrepo/service";
import { ConfigService } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { AuthFacade } from "../src/auth.facade";

describe("AuthFacade", () => {
	let facade: AuthFacade;
	let mockUsersService: jest.Mocked<UsersService>;
	let mockRolesService: jest.Mocked<RolesService>;
	let mockSpacesService: jest.Mocked<SpacesService>;
	let mockTokenService: jest.Mocked<TokenService>;
	let mockTokenStorageService: jest.Mocked<TokenStorageService>;
	let mockAuthCacheService: jest.Mocked<AuthCacheService>;
	let mockEmailService: jest.Mocked<EmailService>;
	let mockClsService: jest.Mocked<ClsService>;

	beforeEach(async () => {
		mockUsersService = {
			getByIdWithTenants: jest.fn(),
			findUserForAuth: jest.fn(),
			createUserForSignUp: jest.fn(),
		} as unknown as jest.Mocked<UsersService>;

		mockRolesService = {
			getDefaultUserRole: jest.fn(),
		} as unknown as jest.Mocked<RolesService>;

		mockSpacesService = {
			createPersonalSpace: jest.fn(),
		} as unknown as jest.Mocked<SpacesService>;

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

		const mockConfigService = {
			get: jest.fn().mockReturnValue({
				issuer: "http://localhost:3007",
				jwksUri: "http://localhost:3007/oidc/jwks",
				clientId: "test-client",
				clientSecret: "test-secret",
				redirectUri: "http://localhost:3000/api/v1/auth/callback",
			}),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthFacade,
				{ provide: UsersService, useValue: mockUsersService },
				{ provide: RolesService, useValue: mockRolesService },
				{ provide: SpacesService, useValue: mockSpacesService },
				{ provide: TokenService, useValue: mockTokenService },
				{ provide: TokenStorageService, useValue: mockTokenStorageService },
				{ provide: AuthCacheService, useValue: mockAuthCacheService },
				{ provide: EmailService, useValue: mockEmailService },
				{ provide: ConfigService, useValue: mockConfigService },
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		facade = module.get<AuthFacade>(AuthFacade);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(facade).toBeDefined();
	});

	describe("getAuthorizationUrl", () => {
		it("PKCE code_challenge와 state를 포함한 URL을 생성해야 한다", async () => {
			// When
			const url = await facade.getAuthorizationUrl();

			// Then
			expect(url).toContain("/oidc/auth?");
			expect(url).toContain("response_type=code");
			expect(url).toContain("code_challenge=");
			expect(url).toContain("code_challenge_method=S256");
			expect(url).toContain("state=");
			expect(mockTokenStorageService.saveOidcState).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(String),
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
			const result = facade.verifyToken();

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
			const result = await facade.getMySpaces();

			// Then
			expect(result).toEqual([]);
		});
	});
});
