import { ServiceUnavailableException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import {
	type RedisThrottlerClient,
	RedisThrottlerStorage,
} from "./redis-throttler-storage";

const createConfigService = (nodeEnvironment: string): ConfigService =>
	({
		get: jest.fn((key: string) => {
			if (key === "NODE_ENV") {
				return nodeEnvironment;
			}
			if (key === "redis") {
				return { host: "redis", port: 6379 };
			}
			return undefined;
		}),
	}) as unknown as ConfigService;

const createRedisClient = (): jest.Mocked<RedisThrottlerClient> => ({
	status: "ready",
	connect: jest.fn(),
	eval: jest.fn(),
	// RedisThrottlerClient 계약상 quit()는 Promise를 반환해야 shutdown의
	// quit().catch() 연쇄가 동작한다.
	quit: jest.fn().mockResolvedValue(undefined),
	on: jest.fn(),
});

describe("RedisThrottlerStorage", () => {
	it("Redis의 원자적 결과를 Nest throttler storage record로 반환해야 한다", async () => {
		const redisClient = createRedisClient();
		redisClient.eval.mockResolvedValue([3, 850, 0, 0]);
		const storage = new RedisThrottlerStorage(
			createConfigService("production"),
			redisClient,
		);

		await expect(
			storage.increment("route-hash", 1000, 10, 1000, "short"),
		).resolves.toEqual({
			totalHits: 3,
			timeToExpire: 850,
			isBlocked: false,
			timeToBlockExpire: 0,
		});
		expect(redisClient.eval).toHaveBeenCalledWith(
			expect.any(String),
			2,
			"throttler:short:route-hash",
			"throttler:short:route-hash:blocked",
			1000,
			10,
			1000,
		);
	});

	it("production Redis 장애는 요청을 fail-closed로 503 처리해야 한다", async () => {
		const redisClient = createRedisClient();
		redisClient.eval.mockRejectedValue(new Error("Redis is unavailable"));
		const storage = new RedisThrottlerStorage(
			createConfigService("production"),
			redisClient,
		);

		await expect(
			storage.increment("route-hash", 1000, 10, 1000, "short"),
		).rejects.toBeInstanceOf(ServiceUnavailableException);
	});

	it("development Redis 장애는 로컬 호환을 위해 in-memory fallback을 사용해야 한다", async () => {
		const redisClient = createRedisClient();
		redisClient.eval.mockRejectedValue(new Error("Redis is unavailable"));
		const storage = new RedisThrottlerStorage(
			createConfigService("development"),
			redisClient,
		);

		await expect(
			storage.increment("route-hash", 1000, 10, 1000, "short"),
		).resolves.toMatchObject({ totalHits: 1, isBlocked: false });
		await storage.onApplicationShutdown();
	});
});
