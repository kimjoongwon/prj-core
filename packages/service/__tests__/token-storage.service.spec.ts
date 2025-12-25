import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { RedisService } from "../src/utils/redis.service";
import { TokenStorageService } from "../src/utils/token-storage.service";

describe("TokenStorageService", () => {
	let service: TokenStorageService;
	let mockRedisService: jest.Mocked<RedisService>;
	let mockConfigService: jest.Mocked<ConfigService>;

	const mockAuthConfig = {
		expires: "1h",
		refresh: "7d",
	};

	beforeEach(async () => {
		mockRedisService = {
			set: jest.fn(),
			get: jest.fn(),
			del: jest.fn(),
			exists: jest.fn(),
		} as any;

		mockConfigService = {
			get: jest.fn().mockReturnValue(mockAuthConfig),
		} as any;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TokenStorageService,
				{ provide: RedisService, useValue: mockRedisService },
				{ provide: ConfigService, useValue: mockConfigService },
			],
		}).compile();

		service = module.get<TokenStorageService>(TokenStorageService);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(service).toBeDefined();
	});

	describe("saveRefreshToken", () => {
		it("리프레시 토큰을 Redis에 저장해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			const refreshToken = "test-refresh-token";
			mockRedisService.set.mockResolvedValue(undefined);

			// When
			await service.saveRefreshToken(userId, refreshToken);

			// Then
			expect(mockRedisService.set).toHaveBeenCalledWith(
				`refresh:${userId}`,
				expect.stringContaining(refreshToken),
				604800, // 7일 = 7 * 24 * 60 * 60 초
			);
		});

		it("기본 TTL을 사용해야 한다 (설정이 없을 때)", async () => {
			// Given
			mockConfigService.get.mockReturnValue(null);
			const userId = "user-test-id";
			const refreshToken = "test-refresh-token";
			mockRedisService.set.mockResolvedValue(undefined);

			// When
			await service.saveRefreshToken(userId, refreshToken);

			// Then
			expect(mockRedisService.set).toHaveBeenCalledWith(
				`refresh:${userId}`,
				expect.any(String),
				604800, // 기본 7일
			);
		});
	});

	describe("getRefreshToken", () => {
		it("저장된 리프레시 토큰을 조회해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			const storedData = JSON.stringify({
				token: "test-refresh-token",
				createdAt: new Date().toISOString(),
			});
			mockRedisService.get.mockResolvedValue(storedData);

			// When
			const result = await service.getRefreshToken(userId);

			// Then
			expect(mockRedisService.get).toHaveBeenCalledWith(`refresh:${userId}`);
			expect(result).toBe("test-refresh-token");
		});

		it("토큰이 없으면 null을 반환해야 한다", async () => {
			// Given
			const userId = "non-existent-user";
			mockRedisService.get.mockResolvedValue(null);

			// When
			const result = await service.getRefreshToken(userId);

			// Then
			expect(result).toBeNull();
		});

		it("잘못된 JSON은 null을 반환해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			mockRedisService.get.mockResolvedValue("invalid-json");

			// When
			const result = await service.getRefreshToken(userId);

			// Then
			expect(result).toBeNull();
		});
	});

	describe("validateRefreshToken", () => {
		it("유효한 리프레시 토큰은 true를 반환해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			const refreshToken = "valid-refresh-token";
			const storedData = JSON.stringify({
				token: refreshToken,
				createdAt: new Date().toISOString(),
			});
			mockRedisService.get.mockResolvedValue(storedData);

			// When
			const result = await service.validateRefreshToken(userId, refreshToken);

			// Then
			expect(result).toBe(true);
		});

		it("일치하지 않는 토큰은 false를 반환해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			const refreshToken = "wrong-token";
			const storedData = JSON.stringify({
				token: "stored-token",
				createdAt: new Date().toISOString(),
			});
			mockRedisService.get.mockResolvedValue(storedData);

			// When
			const result = await service.validateRefreshToken(userId, refreshToken);

			// Then
			expect(result).toBe(false);
		});

		it("저장된 토큰이 없으면 false를 반환해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			mockRedisService.get.mockResolvedValue(null);

			// When
			const result = await service.validateRefreshToken(userId, "any-token");

			// Then
			expect(result).toBe(false);
		});
	});

	describe("deleteRefreshToken", () => {
		it("리프레시 토큰을 삭제해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			mockRedisService.del.mockResolvedValue(1);

			// When
			await service.deleteRefreshToken(userId);

			// Then
			expect(mockRedisService.del).toHaveBeenCalledWith(`refresh:${userId}`);
		});
	});

	describe("addToBlacklist", () => {
		it("액세스 토큰을 블랙리스트에 추가해야 한다", async () => {
			// Given
			const accessToken = "test-access-token";
			mockRedisService.set.mockResolvedValue(undefined);

			// When
			await service.addToBlacklist(accessToken);

			// Then
			expect(mockRedisService.set).toHaveBeenCalledWith(
				expect.stringContaining("blacklist:"),
				"1",
				3600, // 1h = 3600초
			);
		});

		it("사용자 정의 TTL로 블랙리스트에 추가해야 한다", async () => {
			// Given
			const accessToken = "test-access-token";
			const customTtl = 1800;
			mockRedisService.set.mockResolvedValue(undefined);

			// When
			await service.addToBlacklist(accessToken, customTtl);

			// Then
			expect(mockRedisService.set).toHaveBeenCalledWith(
				expect.stringContaining("blacklist:"),
				"1",
				customTtl,
			);
		});
	});

	describe("isBlacklisted", () => {
		it("블랙리스트에 있는 토큰은 true를 반환해야 한다", async () => {
			// Given
			const accessToken = "blacklisted-token";
			mockRedisService.exists.mockResolvedValue(true);

			// When
			const result = await service.isBlacklisted(accessToken);

			// Then
			expect(result).toBe(true);
		});

		it("블랙리스트에 없는 토큰은 false를 반환해야 한다", async () => {
			// Given
			const accessToken = "valid-token";
			mockRedisService.exists.mockResolvedValue(false);

			// When
			const result = await service.isBlacklisted(accessToken);

			// Then
			expect(result).toBe(false);
		});
	});

	describe("invalidateAllUserTokens", () => {
		it("사용자의 모든 토큰을 무효화해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			mockRedisService.del.mockResolvedValue(1);

			// When
			await service.invalidateAllUserTokens(userId);

			// Then
			expect(mockRedisService.del).toHaveBeenCalledWith(`refresh:${userId}`);
		});
	});
});
