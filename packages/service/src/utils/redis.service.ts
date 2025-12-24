import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { RedisConfig } from "@cocrepo/type";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(RedisService.name);
	private client: Redis;

	constructor(private configService: ConfigService) {
		const redisConfig = this.configService.get<RedisConfig>("redis");

		this.client = new Redis({
			host: redisConfig?.host || "localhost",
			port: redisConfig?.port || 6379,
			password: redisConfig?.password || undefined,
			retryStrategy: (times) => {
				if (times > 3) {
					this.logger.error("Redis 연결 재시도 횟수 초과");
					return null;
				}
				return Math.min(times * 200, 2000);
			},
		});

		this.client.on("error", (err) => {
			this.logger.error(`Redis 연결 오류: ${err.message}`);
		});

		this.client.on("connect", () => {
			this.logger.log("Redis 연결 성공");
		});
	}

	async onModuleInit() {
		try {
			await this.client.ping();
			this.logger.log("Redis 연결 확인 완료");
		} catch (error) {
			this.logger.warn(`Redis 연결 실패: ${error}`);
		}
	}

	async onModuleDestroy() {
		await this.client.quit();
		this.logger.log("Redis 연결 종료");
	}

	getClient(): Redis {
		return this.client;
	}

	/**
	 * 값 저장 (TTL 옵션)
	 */
	async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
		if (ttlSeconds) {
			await this.client.setex(key, ttlSeconds, value);
		} else {
			await this.client.set(key, value);
		}
	}

	/**
	 * 값 조회
	 */
	async get(key: string): Promise<string | null> {
		return this.client.get(key);
	}

	/**
	 * 키 삭제
	 */
	async del(key: string): Promise<number> {
		return this.client.del(key);
	}

	/**
	 * 키 존재 여부 확인
	 */
	async exists(key: string): Promise<boolean> {
		const result = await this.client.exists(key);
		return result === 1;
	}

	/**
	 * TTL 설정
	 */
	async expire(key: string, ttlSeconds: number): Promise<boolean> {
		const result = await this.client.expire(key, ttlSeconds);
		return result === 1;
	}

	/**
	 * 패턴으로 키 조회
	 */
	async keys(pattern: string): Promise<string[]> {
		return this.client.keys(pattern);
	}

	/**
	 * 여러 키 삭제
	 */
	async delByPattern(pattern: string): Promise<number> {
		const keys = await this.keys(pattern);
		if (keys.length === 0) return 0;
		return this.client.del(...keys);
	}
}
