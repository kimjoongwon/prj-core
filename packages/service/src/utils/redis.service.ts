import { RedisConfig } from "@cocrepo/type";
import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(RedisService.name);
	private client: Redis;

	constructor(private configService: ConfigService) {
		const redisConfig = this.configService.get<RedisConfig>("redis");

		// 연결 시도 전 설정 로깅
		this.logger.log(
			`Redis 연결 시도: ${redisConfig?.host}:${redisConfig?.port}`,
		);

		this.client = new Redis({
			host: redisConfig?.host || "localhost",
			port: redisConfig?.port || 6379,
			password: redisConfig?.password || undefined,
			retryStrategy: (times) => {
				this.logger.warn(
					`Redis 재연결 시도 ${times}회차 - host: ${redisConfig?.host}`,
				);
				if (times > 3) {
					this.logger.error(
						`Redis 연결 재시도 횟수 초과 (3회) - host: ${redisConfig?.host}`,
					);
					return null;
				}
				const delay = Math.min(times * 200, 2000);
				this.logger.warn(`${delay}ms 후 재시도...`);
				return delay;
			},
		});

		// 에러 이벤트 상세 로깅
		this.client.on("error", (err) => {
			this.logger.error(`Redis 연결 오류: ${JSON.stringify({
				message: err.message,
				code: (err as NodeJS.ErrnoException).code,
				host: redisConfig?.host,
				port: redisConfig?.port,
			})}`);
		});

		// 연결 상태 이벤트 로깅
		this.client.on("connect", () => {
			this.logger.log(
				`Redis 연결 성공: ${redisConfig?.host}:${redisConfig?.port}`,
			);
		});

		this.client.on("ready", () => {
			this.logger.log("Redis 클라이언트 준비 완료");
		});

		this.client.on("close", () => {
			this.logger.warn("Redis 연결 종료됨");
		});

		this.client.on("reconnecting", () => {
			this.logger.warn("Redis 재연결 중...");
		});
	}

	async onModuleInit() {
		try {
			const result = await this.client.ping();
			this.logger.log(`Redis PING 응답: ${result}`);
		} catch (error) {
			const err = error as NodeJS.ErrnoException;
			this.logger.error(`Redis 연결 실패: ${JSON.stringify({
				message: err.message,
				code: err.code,
			})}`);
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
