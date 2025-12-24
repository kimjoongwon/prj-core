import * as crypto from "node:crypto";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthConfig } from "@cocrepo/type";
import { RedisService } from "./redis.service";

/**
 * Redis Key 접두사
 */
const REDIS_KEYS = {
	REFRESH_TOKEN: "refresh:",
	BLACKLIST: "blacklist:",
} as const;

/**
 * JWT expiresIn 문자열을 초 단위로 변환
 */
function parseExpiresInToSeconds(expiresIn: string | number): number {
	if (typeof expiresIn === "number") return expiresIn;

	const match = expiresIn.match(/^(\d+)([smhd])$/);
	if (!match) return 3600; // 기본값 1시간

	const value = Number.parseInt(match[1], 10);
	const unit = match[2];

	const unitToSeconds: Record<string, number> = {
		s: 1,
		m: 60,
		h: 60 * 60,
		d: 24 * 60 * 60,
	};

	return value * unitToSeconds[unit];
}

@Injectable()
export class TokenStorageService {
	private readonly logger = new Logger(TokenStorageService.name);

	constructor(
		private readonly redisService: RedisService,
		private readonly configService: ConfigService,
	) {}

	/**
	 * Refresh Token을 Redis에 저장
	 */
	async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
		const authConfig = this.configService.get<AuthConfig>("auth");
		const ttl = parseExpiresInToSeconds(authConfig?.refresh || "7d");

		const key = `${REDIS_KEYS.REFRESH_TOKEN}${userId}`;
		const tokenData = JSON.stringify({
			token: refreshToken,
			createdAt: new Date().toISOString(),
		});

		await this.redisService.set(key, tokenData, ttl);
		this.logger.debug(`Refresh token 저장: userId=${userId}, ttl=${ttl}s`);
	}

	/**
	 * 저장된 Refresh Token 조회
	 */
	async getRefreshToken(userId: string): Promise<string | null> {
		const key = `${REDIS_KEYS.REFRESH_TOKEN}${userId}`;
		const data = await this.redisService.get(key);

		if (!data) return null;

		try {
			const parsed = JSON.parse(data);
			return parsed.token;
		} catch {
			return null;
		}
	}

	/**
	 * Refresh Token이 유효한지 검증
	 */
	async validateRefreshToken(
		userId: string,
		refreshToken: string,
	): Promise<boolean> {
		const storedToken = await this.getRefreshToken(userId);
		return storedToken === refreshToken;
	}

	/**
	 * Refresh Token 삭제 (로그아웃)
	 */
	async deleteRefreshToken(userId: string): Promise<void> {
		const key = `${REDIS_KEYS.REFRESH_TOKEN}${userId}`;
		await this.redisService.del(key);
		this.logger.debug(`Refresh token 삭제: userId=${userId}`);
	}

	/**
	 * Access Token을 블랙리스트에 추가
	 */
	async addToBlacklist(
		accessToken: string,
		ttlSeconds?: number,
	): Promise<void> {
		const tokenHash = this.hashToken(accessToken);
		const key = `${REDIS_KEYS.BLACKLIST}${tokenHash}`;

		// 기본 TTL: Access Token의 남은 만료 시간 또는 설정된 값
		const authConfig = this.configService.get<AuthConfig>("auth");
		const ttl =
			ttlSeconds || parseExpiresInToSeconds(authConfig?.expires || "1h");

		await this.redisService.set(key, "1", ttl);
		this.logger.debug(`Token 블랙리스트 추가: ttl=${ttl}s`);
	}

	/**
	 * Access Token이 블랙리스트에 있는지 확인
	 */
	async isBlacklisted(accessToken: string): Promise<boolean> {
		const tokenHash = this.hashToken(accessToken);
		const key = `${REDIS_KEYS.BLACKLIST}${tokenHash}`;
		return this.redisService.exists(key);
	}

	/**
	 * 사용자의 모든 토큰 무효화 (비밀번호 변경, 보안 이슈 등)
	 */
	async invalidateAllUserTokens(userId: string): Promise<void> {
		await this.deleteRefreshToken(userId);
		this.logger.log(`사용자 ${userId}의 모든 토큰 무효화됨`);
	}

	/**
	 * 토큰 해시 생성 (블랙리스트용)
	 */
	private hashToken(token: string): string {
		return crypto.createHash("sha256").update(token).digest("hex").slice(0, 32);
	}
}
