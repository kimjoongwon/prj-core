import type { RedisConfig } from "@cocrepo/type";
import {
	Inject,
	Injectable,
	Logger,
	OnApplicationShutdown,
	Optional,
	ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	type ThrottlerStorage,
	ThrottlerStorageService,
} from "@nestjs/throttler";
import Redis from "ioredis";

export interface RedisThrottlerClient {
	status: string;
	connect(): Promise<unknown>;
	eval(
		script: string,
		numberOfKeys: number,
		...arguments_: Array<string | number>
	): Promise<unknown>;
	quit(): Promise<unknown>;
	on(event: "error", listener: (error: Error) => void): unknown;
}

export const REDIS_THROTTLER_CLIENT = Symbol("REDIS_THROTTLER_CLIENT");

interface ThrottlerStorageRecord {
	totalHits: number;
	timeToExpire: number;
	isBlocked: boolean;
	timeToBlockExpire: number;
}

const REDIS_THROTTLER_INCREMENT_SCRIPT = `
local hitKey = KEYS[1]
local blockKey = KEYS[2]
local ttl = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local blockDuration = tonumber(ARGV[3])

if redis.call('EXISTS', blockKey) == 1 then
  return {redis.call('GET', hitKey) or 0, redis.call('PTTL', hitKey), 1, redis.call('PTTL', blockKey)}
end

local totalHits = redis.call('INCR', hitKey)
if totalHits == 1 then
  redis.call('PEXPIRE', hitKey, ttl)
end

local timeToExpire = redis.call('PTTL', hitKey)
if totalHits > limit then
  redis.call('SET', blockKey, '1', 'PX', blockDuration)
  return {totalHits, timeToExpire, 1, blockDuration}
end

return {totalHits, timeToExpire, 0, 0}
`;

const createRedisThrottlerClient = (
	redisConfig: RedisConfig | undefined,
): RedisThrottlerClient =>
	new Redis({
		host: redisConfig?.host ?? "localhost",
		port: redisConfig?.port ?? 6379,
		...(redisConfig?.password ? { password: redisConfig.password } : {}),
		connectTimeout: 1000,
		enableOfflineQueue: false,
		lazyConnect: true,
		maxRetriesPerRequest: 1,
		retryStrategy: () => null,
	});

const toThrottlerStorageRecord = (
	redisResponse: unknown,
): ThrottlerStorageRecord => {
	if (
		!Array.isArray(redisResponse) ||
		redisResponse.length !== 4 ||
		redisResponse.some((value) => typeof value !== "number")
	) {
		throw new Error("Redis throttler returned an invalid storage record.");
	}

	return {
		totalHits: redisResponse[0],
		timeToExpire: Math.max(0, redisResponse[1]),
		isBlocked: redisResponse[2] === 1,
		timeToBlockExpire: Math.max(0, redisResponse[3]),
	};
};

@Injectable()
export class RedisThrottlerStorage
	implements ThrottlerStorage, OnApplicationShutdown
{
	private readonly logger = new Logger(RedisThrottlerStorage.name);
	private readonly isProduction: boolean;
	private readonly fallbackStorage = new ThrottlerStorageService();
	private readonly redisClient: RedisThrottlerClient;
	private connectPromise: Promise<void> | undefined;

	constructor(
		configService: ConfigService,
		@Optional()
		@Inject(REDIS_THROTTLER_CLIENT)
		redisClient?: RedisThrottlerClient,
	) {
		this.isProduction = configService.get<string>("NODE_ENV") === "production";
		this.redisClient =
			redisClient ??
			createRedisThrottlerClient(configService.get<RedisConfig>("redis"));
		this.redisClient.on("error", (error) => {
			this.logger.warn(`Redis throttler connection error: ${error.message}`);
		});
	}

	async increment(
		key: string,
		ttl: number,
		limit: number,
		blockDuration: number,
		throttlerName: string,
	): Promise<ThrottlerStorageRecord> {
		try {
			await this.connectIfNecessary();
			const redisResponse = await this.redisClient.eval(
				REDIS_THROTTLER_INCREMENT_SCRIPT,
				2,
				`throttler:${throttlerName}:${key}`,
				`throttler:${throttlerName}:${key}:blocked`,
				ttl,
				limit,
				blockDuration,
			);
			return toThrottlerStorageRecord(redisResponse);
		} catch (error) {
			if (this.isProduction) {
				throw new ServiceUnavailableException(
					"Rate limiting is temporarily unavailable.",
					{ cause: error instanceof Error ? error : undefined },
				);
			}

			this.logger.warn(
				"Redis throttler is unavailable; development fallback storage is active.",
			);
			return this.fallbackStorage.increment(
				key,
				ttl,
				limit,
				blockDuration,
				throttlerName,
			);
		}
	}

	async onApplicationShutdown(): Promise<void> {
		this.fallbackStorage.onApplicationShutdown();
		if (this.redisClient.status === "end") {
			return;
		}
		await this.redisClient.quit();
	}

	private async connectIfNecessary(): Promise<void> {
		if (this.redisClient.status === "ready") {
			return;
		}
		if (!this.connectPromise) {
			this.connectPromise = Promise.resolve(this.redisClient.connect())
				.then(() => undefined)
				.finally(() => {
					this.connectPromise = undefined;
				});
		}
		await this.connectPromise;
	}
}
