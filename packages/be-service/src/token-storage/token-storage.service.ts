import * as crypto from "node:crypto";
import { AuthConfig } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "../redis/redis.service";

/**
 * Redis Key 접두사
 */
const REDIS_KEYS = {
	REFRESH_TOKEN: "refresh:",
	BLACKLIST: "blacklist:",
	OIDC_STATE: "oidc:state:",
	SESSION: "session:",
} as const;

/**
 * 세션 메타데이터
 */
export interface SessionMetadata {
	refreshToken: string;
	userAgent: string;
	ipAddress: string;
	createdAt: string;
	lastActivityAt: string;
}

/**
 * 세션 정보 (목록 조회용)
 */
export interface SessionInfo {
	sessionId: string;
	userAgent: string;
	ipAddress: string;
	createdAt: string;
	lastActivityAt: string;
	isCurrent: boolean;
}

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

	// =========================================================================
	// 세션 관리 (멀티 디바이스)
	// =========================================================================

	/**
	 * 세션 ID 생성
	 */
	generateSessionId(): string {
		return crypto.randomBytes(16).toString("hex");
	}

	/**
	 * 세션 저장 (로그인 시)
	 */
	async saveSession(
		userId: string,
		sessionId: string,
		refreshToken: string,
		metadata: { userAgent: string; ipAddress: string },
	): Promise<void> {
		const authConfig = this.configService.get<AuthConfig>("auth");
		const ttl = parseExpiresInToSeconds(authConfig?.refresh || "7d");

		const key = `${REDIS_KEYS.SESSION}${userId}:${sessionId}`;
		const now = new Date().toISOString();
		const sessionData: SessionMetadata = {
			refreshToken,
			userAgent: metadata.userAgent,
			ipAddress: metadata.ipAddress,
			createdAt: now,
			lastActivityAt: now,
		};

		await this.redisService.set(key, JSON.stringify(sessionData), ttl);
		this.logger.debug(
			`세션 저장: userId=${userId}, sessionId=${sessionId}, ttl=${ttl}s`,
		);
	}

	/**
	 * 세션의 Refresh Token 조회
	 */
	async getSessionRefreshToken(
		userId: string,
		sessionId: string,
	): Promise<string | null> {
		const key = `${REDIS_KEYS.SESSION}${userId}:${sessionId}`;
		const data = await this.redisService.get(key);
		if (!data) return null;

		try {
			const session = JSON.parse(data) as SessionMetadata;
			return session.refreshToken;
		} catch {
			return null;
		}
	}

	/**
	 * 세션 활동 시간 및 Refresh Token 업데이트 (토큰 갱신 시)
	 */
	async updateSession(
		userId: string,
		sessionId: string,
		refreshToken: string,
	): Promise<void> {
		const key = `${REDIS_KEYS.SESSION}${userId}:${sessionId}`;
		const data = await this.redisService.get(key);
		if (!data) return;

		try {
			const session = JSON.parse(data) as SessionMetadata;
			session.refreshToken = refreshToken;
			session.lastActivityAt = new Date().toISOString();

			const authConfig = this.configService.get<AuthConfig>("auth");
			const ttl = parseExpiresInToSeconds(authConfig?.refresh || "7d");

			await this.redisService.set(key, JSON.stringify(session), ttl);
		} catch {
			this.logger.warn(`세션 업데이트 실패: sessionId=${sessionId}`);
		}
	}

	/**
	 * 사용자의 모든 세션 목록 조회
	 */
	async getUserSessions(
		userId: string,
		currentSessionId?: string,
	): Promise<SessionInfo[]> {
		const pattern = `${REDIS_KEYS.SESSION}${userId}:*`;
		const keys = await this.redisService.keys(pattern);

		const sessions: SessionInfo[] = [];
		const prefix = `${REDIS_KEYS.SESSION}${userId}:`;

		for (const key of keys) {
			const data = await this.redisService.get(key);
			if (!data) continue;

			try {
				const session = JSON.parse(data) as SessionMetadata;
				const sessionId = key.slice(prefix.length);

				sessions.push({
					sessionId,
					userAgent: session.userAgent,
					ipAddress: session.ipAddress,
					createdAt: session.createdAt,
					lastActivityAt: session.lastActivityAt,
					isCurrent: sessionId === currentSessionId,
				});
			} catch {
				continue;
			}
		}

		// 최근 활동 순 정렬
		sessions.sort(
			(a, b) =>
				new Date(b.lastActivityAt).getTime() -
				new Date(a.lastActivityAt).getTime(),
		);

		return sessions;
	}

	/**
	 * 특정 세션 삭제
	 */
	async deleteSession(userId: string, sessionId: string): Promise<void> {
		const key = `${REDIS_KEYS.SESSION}${userId}:${sessionId}`;
		await this.redisService.del(key);
		this.logger.debug(`세션 삭제: userId=${userId}, sessionId=${sessionId}`);
	}

	/**
	 * 현재 세션을 제외한 다른 모든 세션 삭제
	 */
	async deleteOtherSessions(
		userId: string,
		currentSessionId: string,
	): Promise<number> {
		const pattern = `${REDIS_KEYS.SESSION}${userId}:*`;
		const keys = await this.redisService.keys(pattern);

		const currentKey = `${REDIS_KEYS.SESSION}${userId}:${currentSessionId}`;
		const keysToDelete = keys.filter((k) => k !== currentKey);

		if (keysToDelete.length === 0) return 0;

		for (const key of keysToDelete) {
			await this.redisService.del(key);
		}

		this.logger.debug(
			`다른 세션 ${keysToDelete.length}개 삭제: userId=${userId}`,
		);
		return keysToDelete.length;
	}

	/**
	 * 사용자의 모든 세션 삭제 (관리자 강제 종료, 비밀번호 변경 등)
	 */
	async deleteAllSessions(userId: string): Promise<void> {
		const pattern = `${REDIS_KEYS.SESSION}${userId}:*`;
		await this.redisService.delByPattern(pattern);
		this.logger.debug(`모든 세션 삭제: userId=${userId}`);
	}

	/**
	 * 특정 세션의 Refresh Token 가져오기 (IDP Revocation용)
	 */
	async getSessionForRevocation(
		userId: string,
		sessionId: string,
	): Promise<SessionMetadata | null> {
		const key = `${REDIS_KEYS.SESSION}${userId}:${sessionId}`;
		const data = await this.redisService.get(key);
		if (!data) return null;

		try {
			return JSON.parse(data) as SessionMetadata;
		} catch {
			return null;
		}
	}

	// =========================================================================
	// 레거시 호환 (기존 단일 Refresh Token 방식)
	// =========================================================================

	/**
	 * Refresh Token을 Redis에 저장
	 * @deprecated 세션 기반 saveSession 사용 권장
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
	 * Refresh Token 삭제 + 모든 세션 삭제
	 */
	async deleteRefreshToken(userId: string): Promise<void> {
		const key = `${REDIS_KEYS.REFRESH_TOKEN}${userId}`;
		await this.redisService.del(key);
		// 세션 기반도 함께 삭제
		await this.deleteAllSessions(userId);
		this.logger.debug(`Refresh token + 세션 삭제: userId=${userId}`);
	}

	// =========================================================================
	// Access Token 블랙리스트
	// =========================================================================

	/**
	 * Access Token을 블랙리스트에 추가
	 */
	async addToBlacklist(
		accessToken: string,
		ttlSeconds?: number,
	): Promise<void> {
		const tokenHash = this.hashToken(accessToken);
		const key = `${REDIS_KEYS.BLACKLIST}${tokenHash}`;

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

	// =========================================================================
	// OIDC State (CSRF 방지 + PKCE)
	// =========================================================================

	/**
	 * OIDC State와 PKCE code_verifier를 Redis에 저장 (CSRF 방지 + PKCE)
	 * returnTo: 인증 완료 후 리다이렉트할 앱 경로 (예: /admin/dashboard, /oidc-clients)
	 */
	async saveOidcState(
		state: string,
		codeVerifier: string,
		ttlSeconds = 600,
		returnTo?: string,
	): Promise<void> {
		const key = `${REDIS_KEYS.OIDC_STATE}${state}`;
		const value = JSON.stringify({ codeVerifier, returnTo });
		await this.redisService.set(key, value, ttlSeconds);
		this.logger.debug(`OIDC state + PKCE 저장: ttl=${ttlSeconds}s`);
	}

	/**
	 * OIDC State 검증 및 소비 (일회용)
	 * getdel 패턴으로 존재 확인, 값 반환, 삭제를 처리하여 Race Condition 방지
	 * @returns { codeVerifier, returnTo } 또는 null
	 */
	async validateAndConsumeOidcState(
		state: string,
	): Promise<{ codeVerifier: string; returnTo?: string } | null> {
		const key = `${REDIS_KEYS.OIDC_STATE}${state}`;
		const raw = await this.redisService.get(key);
		if (!raw) return null;

		await this.redisService.del(key);

		// 하위호환: 기존 저장된 plain string(codeVerifier만)도 처리
		try {
			return JSON.parse(raw);
		} catch {
			return { codeVerifier: raw };
		}
	}

	/**
	 * 토큰 해시 생성 (블랙리스트용)
	 */
	private hashToken(token: string): string {
		return crypto.createHash("sha256").update(token).digest("hex").slice(0, 32);
	}
}
