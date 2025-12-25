import { Token } from "@cocrepo/constant";
import {
	BadRequestException,
	InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, NotBeforeError, TokenExpiredError } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { TokenService } from "../src/utils/token.service";
import { TokenStorageService } from "../src/utils/token-storage.service";

describe("TokenService", () => {
	let service: TokenService;
	let mockJwtService: jest.Mocked<JwtService>;
	let mockConfigService: jest.Mocked<ConfigService>;
	let mockTokenStorageService: jest.Mocked<TokenStorageService>;
	let mockClsService: jest.Mocked<ClsService>;

	const mockAuthConfig = {
		expires: "1h",
		refresh: "7d",
	};

	// 실제 JWT 형식의 테스트 토큰 (Value Object 검증 통과용)
	const MOCK_ACCESS_TOKEN =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLXRlc3QtaWQifQ.mock-signature";
	const MOCK_REFRESH_TOKEN =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLXRlc3QtaWQiLCJ0eXBlIjoicmVmcmVzaCJ9.mock-signature";

	beforeEach(async () => {
		mockJwtService = {
			sign: jest.fn(),
			verify: jest.fn(),
		} as any;

		mockConfigService = {
			get: jest.fn().mockReturnValue(mockAuthConfig),
		} as any;

		mockTokenStorageService = {
			saveRefreshToken: jest.fn(),
			validateRefreshToken: jest.fn(),
			deleteRefreshToken: jest.fn(),
			addToBlacklist: jest.fn(),
			isBlacklisted: jest.fn(),
		} as any;

		mockClsService = {
			get: jest.fn(),
		} as any;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TokenService,
				{ provide: JwtService, useValue: mockJwtService },
				{ provide: ConfigService, useValue: mockConfigService },
				{ provide: TokenStorageService, useValue: mockTokenStorageService },
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		service = module.get<TokenService>(TokenService);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(service).toBeDefined();
	});

	describe("getTokenFromRequest", () => {
		it("요청에서 액세스 토큰을 가져와야 한다", () => {
			// Given
			const mockReq = {
				cookies: { [Token.ACCESS]: "test-access-token" },
			} as any;

			// When
			const result = service.getTokenFromRequest(mockReq);

			// Then
			expect(result).toBe("test-access-token");
		});

		it("지정된 키로 토큰을 가져와야 한다", () => {
			// Given
			const mockReq = {
				cookies: { [Token.REFRESH]: "test-refresh-token" },
			} as any;

			// When
			const result = service.getTokenFromRequest(mockReq, Token.REFRESH);

			// Then
			expect(result).toBe("test-refresh-token");
		});

		it("토큰이 없으면 BadRequestException을 던져야 한다", () => {
			// Given
			const mockReq = { cookies: {} } as any;

			// When & Then
			expect(() => service.getTokenFromRequest(mockReq)).toThrow(
				BadRequestException,
			);
		});
	});

	describe("setTokenToHTTPOnlyCookie", () => {
		it("액세스 토큰을 쿠키에 설정해야 한다", () => {
			// Given
			const mockRes = { cookie: jest.fn() } as any;
			const token = "test-access-token";

			// When
			service.setTokenToHTTPOnlyCookie(mockRes, Token.ACCESS, token);

			// Then
			expect(mockRes.cookie).toHaveBeenCalledWith(
				Token.ACCESS,
				token,
				expect.objectContaining({
					httpOnly: true,
				}),
			);
		});

		it("리프레시 토큰을 쿠키에 설정해야 한다", () => {
			// Given
			const mockRes = { cookie: jest.fn() } as any;
			const token = "test-refresh-token";

			// When
			service.setTokenToHTTPOnlyCookie(mockRes, Token.REFRESH, token);

			// Then
			expect(mockRes.cookie).toHaveBeenCalledWith(
				Token.REFRESH,
				token,
				expect.objectContaining({
					httpOnly: true,
				}),
			);
		});

		it("auth 설정이 없으면 에러를 던져야 한다", () => {
			// Given
			mockConfigService.get.mockReturnValue(null);
			const mockRes = { cookie: jest.fn() } as any;

			// When & Then
			expect(() =>
				service.setTokenToHTTPOnlyCookie(mockRes, Token.ACCESS, "token"),
			).toThrow("Auth configuration is not defined.");
		});
	});

	describe("generateAccessToken", () => {
		it("액세스 토큰을 생성해야 한다", () => {
			// Given
			const payload = { userId: "user-test-id" };
			mockJwtService.sign.mockReturnValue("generated-access-token");

			// When
			const result = service.generateAccessToken(payload);

			// Then
			expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
			expect(result).toBe("generated-access-token");
		});
	});

	describe("generateRefreshToken", () => {
		it("리프레시 토큰을 생성해야 한다", () => {
			// Given
			const payload = { userId: "user-test-id" };
			mockJwtService.sign.mockReturnValue("generated-refresh-token");

			// When
			const result = service.generateRefreshToken(payload);

			// Then
			expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
				expiresIn: "7d",
			});
			expect(result).toBe("generated-refresh-token");
		});

		it("auth 설정이 없으면 에러를 던져야 한다", () => {
			// Given
			mockConfigService.get.mockReturnValue(null);
			const payload = { userId: "user-test-id" };

			// When & Then
			expect(() => service.generateRefreshToken(payload)).toThrow(
				"JWT refresh expiration is not defined.",
			);
		});
	});

	describe("generateTokens", () => {
		it("액세스 토큰과 리프레시 토큰 쌍을 생성해야 한다", () => {
			// Given
			const payload = { userId: "user-test-id" };
			mockJwtService.sign
				.mockReturnValueOnce(MOCK_ACCESS_TOKEN)
				.mockReturnValueOnce(MOCK_REFRESH_TOKEN);

			// When
			const result = service.generateTokens(payload);

			// Then
			expect(result.accessToken.value).toBe(MOCK_ACCESS_TOKEN);
			expect(result.refreshToken.value).toBe(MOCK_REFRESH_TOKEN);
		});
	});

	describe("generateTokensWithStorage", () => {
		it("토큰을 생성하고 Redis에 저장해야 한다", async () => {
			// Given
			const payload = { userId: "user-test-id" };
			mockJwtService.sign
				.mockReturnValueOnce(MOCK_ACCESS_TOKEN)
				.mockReturnValueOnce(MOCK_REFRESH_TOKEN);
			mockTokenStorageService.saveRefreshToken.mockResolvedValue(undefined);

			// When
			const result = await service.generateTokensWithStorage(payload);

			// Then
			expect(mockTokenStorageService.saveRefreshToken).toHaveBeenCalledWith(
				"user-test-id",
				MOCK_REFRESH_TOKEN,
			);
			expect(result.accessToken.value).toBe(MOCK_ACCESS_TOKEN);
		});
	});

	describe("validateRefreshTokenFromStorage", () => {
		it("저장된 리프레시 토큰을 검증해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			const refreshToken = "valid-refresh-token";
			mockTokenStorageService.validateRefreshToken.mockResolvedValue(true);

			// When
			const result = await service.validateRefreshTokenFromStorage(
				userId,
				refreshToken,
			);

			// Then
			expect(mockTokenStorageService.validateRefreshToken).toHaveBeenCalledWith(
				userId,
				refreshToken,
			);
			expect(result).toBe(true);
		});
	});

	describe("invalidateTokens", () => {
		it("토큰을 무효화해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			const accessToken = "access-token";
			mockTokenStorageService.deleteRefreshToken.mockResolvedValue(undefined);
			mockTokenStorageService.addToBlacklist.mockResolvedValue(undefined);

			// When
			await service.invalidateTokens(userId, accessToken);

			// Then
			expect(mockTokenStorageService.deleteRefreshToken).toHaveBeenCalledWith(
				userId,
			);
			expect(mockTokenStorageService.addToBlacklist).toHaveBeenCalledWith(
				accessToken,
			);
		});

		it("액세스 토큰 없이 리프레시 토큰만 삭제해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			mockTokenStorageService.deleteRefreshToken.mockResolvedValue(undefined);

			// When
			await service.invalidateTokens(userId);

			// Then
			expect(mockTokenStorageService.deleteRefreshToken).toHaveBeenCalledWith(
				userId,
			);
			expect(mockTokenStorageService.addToBlacklist).not.toHaveBeenCalled();
		});
	});

	describe("isTokenBlacklisted", () => {
		it("토큰이 블랙리스트에 있는지 확인해야 한다", async () => {
			// Given
			const accessToken = "blacklisted-token";
			mockTokenStorageService.isBlacklisted.mockResolvedValue(true);

			// When
			const result = await service.isTokenBlacklisted(accessToken);

			// Then
			expect(mockTokenStorageService.isBlacklisted).toHaveBeenCalledWith(
				accessToken,
			);
			expect(result).toBe(true);
		});
	});

	describe("validateToken", () => {
		it("유효한 토큰을 검증해야 한다", () => {
			// Given
			const token = "valid-token";
			const payload = { userId: "user-test-id" };
			mockJwtService.verify.mockReturnValue(payload);

			// When
			const result = service.validateToken(token);

			// Then
			expect(mockJwtService.verify).toHaveBeenCalledWith(token);
			expect(result).toEqual(payload);
		});

		it("만료된 토큰은 BadRequestException을 던져야 한다", () => {
			// Given
			const token = "expired-token";
			mockJwtService.verify.mockImplementation(() => {
				throw new TokenExpiredError("Token expired", new Date());
			});

			// When & Then
			expect(() => service.validateToken(token)).toThrow(BadRequestException);
		});

		it("아직 사용할 수 없는 토큰은 BadRequestException을 던져야 한다", () => {
			// Given
			const token = "not-before-token";
			mockJwtService.verify.mockImplementation(() => {
				throw new NotBeforeError("Token not active", new Date());
			});

			// When & Then
			expect(() => service.validateToken(token)).toThrow(BadRequestException);
		});

		it("알 수 없는 에러는 InternalServerErrorException을 던져야 한다", () => {
			// Given
			const token = "invalid-token";
			mockJwtService.verify.mockImplementation(() => {
				throw new Error("Unknown error");
			});

			// When & Then
			expect(() => service.validateToken(token)).toThrow(
				InternalServerErrorException,
			);
		});
	});

	describe("verifyToken", () => {
		it("유효한 토큰은 true를 반환해야 한다", () => {
			// Given
			const token = "valid-token";
			mockJwtService.verify.mockReturnValue({ userId: "user-test-id" });

			// When
			const result = service.verifyToken(token);

			// Then
			expect(result).toBe(true);
		});

		it("유효하지 않은 토큰은 false를 반환해야 한다", () => {
			// Given
			const token = "invalid-token";
			mockJwtService.verify.mockImplementation(() => {
				throw new Error("Invalid token");
			});

			// When
			const result = service.verifyToken(token);

			// Then
			expect(result).toBe(false);
		});
	});
});
