import type { QueryOidcSessionDto } from "@cocrepo/dto";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";

const KEY_PREFIX = "oidc";

/** 보조 인덱스 키 세그먼트 (이 세그먼트를 포함하는 키는 데이터 키가 아님) */
const INDEX_SEGMENTS = [":uid:", ":userCode:", ":grant:"];

/** OIDC 모델 타입 목록 */
const MODEL_TYPES = [
	"Session",
	"AccessToken",
	"RefreshToken",
	"AuthorizationCode",
	"Grant",
	"ClientCredentials",
	"DeviceCode",
	"Interaction",
];

export interface OidcRedisSession {
	key: string;
	modelType: string;
	grantId: string | null;
	uid: string | null;
	accountId: string | null;
	expiresAt: Date | null;
	createdAt: Date;
}

export interface OidcSessionStats {
	totalCount: number;
	byModelType: Record<string, number>;
}

@Injectable()
export class OidcSessionsService {
	private readonly logger = new Logger(OidcSessionsService.name);

	constructor(private readonly redisService: RedisService) {}

	/**
	 * Redis에서 모든 OIDC 세션 데이터를 수집합니다 (내부 공통 메서드)
	 */
	private async collectAllSessions(
		targetTypes: string[],
	): Promise<OidcRedisSession[]> {
		const allSessions: OidcRedisSession[] = [];

		for (const modelType of targetTypes) {
			const pattern = `${KEY_PREFIX}:${modelType}:*`;
			const keys = await this.redisService.keys(pattern);

			// 보조 인덱스 키 필터링
			const dataKeys = keys.filter(
				(k) => !INDEX_SEGMENTS.some((seg) => k.includes(seg)),
			);

			if (dataKeys.length === 0) continue;

			const client = this.redisService.getClient();
			const values = await client.mget(...dataKeys);

			for (let i = 0; i < dataKeys.length; i++) {
				const value = values[i];
				if (!value) continue;

				const payload = JSON.parse(value) as Record<string, unknown>;
				const id = dataKeys[i].replace(`${KEY_PREFIX}:${modelType}:`, "");

				allSessions.push({
					key: id,
					modelType,
					grantId: (payload.grantId as string) ?? null,
					uid: (payload.uid as string) ?? null,
					accountId: (payload.accountId as string) ?? null,
					expiresAt: payload.exp
						? new Date((payload.exp as number) * 1000)
						: null,
					createdAt: payload.iat
						? new Date((payload.iat as number) * 1000)
						: new Date(),
				});
			}
		}

		return allSessions;
	}

	async getMany(query: QueryOidcSessionDto): Promise<{
		data: OidcRedisSession[];
		totalCount: number;
	}> {
		this.logger.debug("OIDC 세션/토큰 목록 조회 (Redis)");

		const targetTypes = query.modelType
			? [query.modelType]
			: MODEL_TYPES;

		let allSessions = await this.collectAllSessions(targetTypes);

		// accountId 필터 적용
		if (query.accountId) {
			const search = query.accountId.toLowerCase();
			allSessions = allSessions.filter(
				(s) => s.accountId?.toLowerCase().includes(search),
			);
		}

		// 생성일 역순 정렬
		allSessions.sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
		);

		const skip = query.skip ?? 0;
		const take = query.take ?? 20;
		const paginated = allSessions.slice(skip, skip + take);

		return {
			data: paginated,
			totalCount: allSessions.length,
		};
	}

	/**
	 * 모델 타입별 세션/토큰 통계 조회
	 */
	async getStats(): Promise<OidcSessionStats> {
		this.logger.debug("OIDC 세션/토큰 통계 조회");

		const byModelType: Record<string, number> = {};
		let totalCount = 0;

		for (const modelType of MODEL_TYPES) {
			const pattern = `${KEY_PREFIX}:${modelType}:*`;
			const keys = await this.redisService.keys(pattern);
			const dataKeys = keys.filter(
				(k) => !INDEX_SEGMENTS.some((seg) => k.includes(seg)),
			);
			byModelType[modelType] = dataKeys.length;
			totalCount += dataKeys.length;
		}

		return { totalCount, byModelType };
	}

	/**
	 * 모든 세션/토큰 일괄 폐기
	 */
	async revokeAll(): Promise<number> {
		this.logger.debug("모든 OIDC 세션/토큰 일괄 폐기");

		let totalDeleted = 0;

		for (const modelType of MODEL_TYPES) {
			const pattern = `${KEY_PREFIX}:${modelType}:*`;
			const deleted = await this.redisService.delByPattern(pattern);
			totalDeleted += deleted;
		}

		return totalDeleted;
	}

	async revokeByKey(keyId: string): Promise<void> {
		this.logger.debug(`세션/토큰 단건 폐기: ${keyId.slice(0, 8)}...`);

		// 모든 모델 타입에서 키를 찾음
		const client = this.redisService.getClient();
		let found = false;

		for (const modelType of MODEL_TYPES) {
			const redisKey = `${KEY_PREFIX}:${modelType}:${keyId}`;
			const data = await this.redisService.get(redisKey);

			if (data) {
				found = true;
				const payload = JSON.parse(data) as Record<string, unknown>;
				const pipeline = client.pipeline();

				pipeline.del(redisKey);

				if (payload.uid) {
					pipeline.del(`${KEY_PREFIX}:${modelType}:uid:${payload.uid}`);
				}
				if (payload.userCode) {
					pipeline.del(`${KEY_PREFIX}:${modelType}:userCode:${payload.userCode}`);
				}
				if (payload.grantId) {
					pipeline.srem(`${KEY_PREFIX}:${modelType}:grant:${payload.grantId}`, keyId);
				}

				await pipeline.exec();
				break;
			}
		}

		if (!found) {
			throw new NotFoundException("세션/토큰을 찾을 수 없습니다");
		}
	}

	async revokeByGrantId(grantId: string): Promise<number> {
		this.logger.debug(`Grant 일괄 폐기: ${grantId.slice(0, 8)}...`);

		const client = this.redisService.getClient();
		let totalDeleted = 0;

		for (const modelType of MODEL_TYPES) {
			const grantKey = `${KEY_PREFIX}:${modelType}:grant:${grantId}`;
			const members = await client.smembers(grantKey);

			if (members.length === 0) continue;

			const pipeline = client.pipeline();

			for (const id of members) {
				const mainKey = `${KEY_PREFIX}:${modelType}:${id}`;
				const data = await this.redisService.get(mainKey);
				pipeline.del(mainKey);

				if (data) {
					const payload = JSON.parse(data) as Record<string, unknown>;
					if (payload.uid) {
						pipeline.del(`${KEY_PREFIX}:${modelType}:uid:${payload.uid}`);
					}
					if (payload.userCode) {
						pipeline.del(`${KEY_PREFIX}:${modelType}:userCode:${payload.userCode}`);
					}
				}
			}

			pipeline.del(grantKey);
			await pipeline.exec();
			totalDeleted += members.length;
		}

		if (totalDeleted === 0) {
			throw new NotFoundException(
				"해당 Grant에 연결된 세션/토큰이 없습니다",
			);
		}

		return totalDeleted;
	}
}
