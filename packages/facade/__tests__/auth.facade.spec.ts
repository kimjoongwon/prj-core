import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import { PrismaService, TokenService, UsersService } from "@cocrepo/service";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthFacade } from "../src/auth.facade";

describe("AuthFacade", () => {
	let facade: AuthFacade;
	let mockUsersService: jest.Mocked<UsersService>;
	let mockJwtService: jest.Mocked<JwtService>;
	let mockTokenService: jest.Mocked<TokenService>;
	let mockPrismaService: jest.Mocked<PrismaService>;

	const mockUser = {
		id: "user-test-id",
		email: "test@example.com",
		name: "Test User",
		phone: "010-1234-5678",
		password: "$2b$10$hashedPassword",
		tenants: [],
		profiles: [],
	};

	beforeEach(async () => {
		mockUsersService = {
			getByIdWithTenants: jest.fn(),
			findUserForAuth: jest.fn(),
		} as any;

		mockJwtService = {
			verify: jest.fn(),
			sign: jest.fn(),
		} as any;

		mockTokenService = {
			generateTokens: jest.fn(),
			generateTokensWithStorage: jest.fn(),
			validateRefreshTokenFromStorage: jest.fn(),
			invalidateTokens: jest.fn(),
			isTokenBlacklisted: jest.fn(),
		} as any;

		mockPrismaService = {
			role: { findFirst: jest.fn() },
			space: { create: jest.fn() },
			user: { create: jest.fn() },
		} as any;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthFacade,
				{ provide: UsersService, useValue: mockUsersService },
				{ provide: JwtService, useValue: mockJwtService },
				{ provide: TokenService, useValue: mockTokenService },
				{ provide: PRISMA_SERVICE_TOKEN, useValue: mockPrismaService },
			],
		}).compile();

		facade = module.get<AuthFacade>(AuthFacade);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(facade).toBeDefined();
	});

	describe("getCurrentUser", () => {
		it("액세스 토큰으로 현재 사용자를 조회해야 한다", async () => {
			// Given
			const accessToken = "valid-access-token";
			mockJwtService.verify.mockReturnValue({ userId: "user-test-id" });
			mockUsersService.getByIdWithTenants.mockResolvedValue(mockUser as any);

			// When
			const result = await facade.getCurrentUser(accessToken);

			// Then
			expect(mockJwtService.verify).toHaveBeenCalledWith(accessToken);
			expect(mockUsersService.getByIdWithTenants).toHaveBeenCalledWith(
				"user-test-id",
			);
			expect(result).toEqual(mockUser);
		});

		it("유효하지 않은 토큰이면 에러를 던져야 한다", async () => {
			// Given
			const accessToken = "invalid-token";
			mockJwtService.verify.mockImplementation(() => {
				throw new Error("Invalid token");
			});

			// When & Then
			await expect(facade.getCurrentUser(accessToken)).rejects.toThrow(
				"Invalid token",
			);
		});
	});

	describe("getNewToken", () => {
		it("리프레시 토큰으로 새로운 토큰을 생성해야 한다", async () => {
			// Given
			const refreshToken = "valid-refresh-token";
			const mockTokenPair = {
				accessToken: { value: "new-access-token" },
				refreshToken: { value: "new-refresh-token" },
			};

			mockJwtService.verify.mockReturnValue({ userId: "user-test-id" });
			mockTokenService.validateRefreshTokenFromStorage.mockResolvedValue(true);
			mockTokenService.generateTokensWithStorage.mockResolvedValue(
				mockTokenPair as any,
			);

			// When
			const result = await facade.getNewToken(refreshToken);

			// Then
			expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken);
			expect(
				mockTokenService.validateRefreshTokenFromStorage,
			).toHaveBeenCalledWith("user-test-id", refreshToken);
			expect(result).toEqual({
				newAccessToken: "new-access-token",
				newRefreshToken: "new-refresh-token",
			});
		});

		it("유효하지 않은 리프레시 토큰이면 UnauthorizedException을 던져야 한다", async () => {
			// Given
			const refreshToken = "invalid-refresh-token";
			mockJwtService.verify.mockReturnValue({ userId: "user-test-id" });
			mockTokenService.validateRefreshTokenFromStorage.mockResolvedValue(false);

			// When & Then
			await expect(facade.getNewToken(refreshToken)).rejects.toThrow(
				"유효하지 않은 리프레시 토큰입니다.",
			);
		});
	});

	describe("logout", () => {
		it("토큰을 무효화해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			const accessToken = "access-token";
			mockTokenService.invalidateTokens.mockResolvedValue(undefined);

			// When
			await facade.logout(userId, accessToken);

			// Then
			expect(mockTokenService.invalidateTokens).toHaveBeenCalledWith(
				userId,
				accessToken,
			);
		});

		it("액세스 토큰 없이 로그아웃해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			mockTokenService.invalidateTokens.mockResolvedValue(undefined);

			// When
			await facade.logout(userId);

			// Then
			expect(mockTokenService.invalidateTokens).toHaveBeenCalledWith(
				userId,
				undefined,
			);
		});
	});

	describe("isTokenBlacklisted", () => {
		it("블랙리스트된 토큰은 true를 반환해야 한다", async () => {
			// Given
			const accessToken = "blacklisted-token";
			mockTokenService.isTokenBlacklisted.mockResolvedValue(true);

			// When
			const result = await facade.isTokenBlacklisted(accessToken);

			// Then
			expect(mockTokenService.isTokenBlacklisted).toHaveBeenCalledWith(
				accessToken,
			);
			expect(result).toBe(true);
		});

		it("블랙리스트에 없는 토큰은 false를 반환해야 한다", async () => {
			// Given
			const accessToken = "valid-token";
			mockTokenService.isTokenBlacklisted.mockResolvedValue(false);

			// When
			const result = await facade.isTokenBlacklisted(accessToken);

			// Then
			expect(result).toBe(false);
		});
	});
});
