import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../redis.service";

/** 인증 사용자 캐시 키 접두사 */
const AUTH_USER_CACHE_PREFIX = "auth:user:";
/** 최대 TTL (5분) */
const AUTH_USER_CACHE_MAX_TTL = 300;

/**
 * 인증 사용자 정보 Redis 캐시 서비스
 *
 * JwtStrategy와 UserService 등 여러 곳에서 사용하는 인증 캐시 로직을 중앙화합니다.
 * 모든 Redis 호출은 try-catch로 감싸서 Redis 장애 시에도 인증 플로우가 중단되지 않습니다.
 */
@Injectable()
export class AuthCacheService {
	private readonly logger = new Logger(AuthCacheService.name);

	constructor(private readonly redisService: RedisService) {}

	/**
	 * 캐시된 사용자 데이터 조회
	 * Redis 장애 시 null 반환 (DB fallback 유도)
	 */
	async get(userId: string): Promise<string | null> {
		try {
			return await this.redisService.get(`${AUTH_USER_CACHE_PREFIX}${userId}`);
		} catch (error) {
			this.logger.warn(
				`인증 캐시 조회 실패: ${error instanceof Error ? error.message : String(error)}`,
			);
			return null;
		}
	}

	/**
	 * 사용자 데이터 캐시 저장
	 * TTL = min(JWT 남은 시간, 5분). Redis 장애 시 무시 (fire-and-forget)
	 */
	async set(
		userId: string,
		data: string,
		jwtRemainingSeconds: number,
	): Promise<void> {
		const ttl = Math.min(
			Math.max(jwtRemainingSeconds, 1),
			AUTH_USER_CACHE_MAX_TTL,
		);
		try {
			await this.redisService.set(
				`${AUTH_USER_CACHE_PREFIX}${userId}`,
				data,
				ttl,
			);
		} catch (error) {
			this.logger.warn(
				`인증 캐시 저장 실패: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	/**
	 * 사용자 캐시 무효화
	 * Redis 장애 시 무시 (TTL 만료로 자연 정리)
	 */
	async invalidate(userId: string): Promise<void> {
		try {
			await this.redisService.del(`${AUTH_USER_CACHE_PREFIX}${userId}`);
			this.logger.debug(`인증 캐시 무효화: userId=${userId}`);
		} catch (error) {
			this.logger.warn(
				`인증 캐시 무효화 실패: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
}
