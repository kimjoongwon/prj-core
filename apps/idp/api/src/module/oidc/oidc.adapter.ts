import { RedisService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";
import type { AdapterPayload, OidcAdapter } from "./types";

const KEY_PREFIX = "oidc";

function key(modelType: string, id: string): string {
	return `${KEY_PREFIX}:${modelType}:${id}`;
}

function uidKey(modelType: string, uid: string): string {
	return `${KEY_PREFIX}:${modelType}:uid:${uid}`;
}

function userCodeKey(modelType: string, userCode: string): string {
	return `${KEY_PREFIX}:${modelType}:userCode:${userCode}`;
}

function grantKey(modelType: string, grantId: string): string {
	return `${KEY_PREFIX}:${modelType}:grant:${grantId}`;
}

/**
 * Redis Adapter for oidc-provider
 *
 * oidc-provider가 토큰, 세션 등을 저장/조회할 때 사용하는 어댑터.
 * Redis의 네이티브 TTL을 활용하여 만료 관리를 자동화합니다.
 */
export class RedisOidcAdapter implements OidcAdapter {
	constructor(
		private readonly modelType: string,
		private readonly redisService: RedisService,
	) {}

	async upsert(
		id: string,
		payload: AdapterPayload,
		expiresIn: number,
	): Promise<void> {
		const mainKey = key(this.modelType, id);
		const data = JSON.stringify(payload);
		const client = this.redisService.getClient();
		const pipeline = client.pipeline();

		if (expiresIn) {
			pipeline.setex(mainKey, expiresIn, data);
		} else {
			pipeline.set(mainKey, data);
		}

		// uid 보조 인덱스 (Session 조회용)
		if (payload.uid) {
			const uid = uidKey(this.modelType, payload.uid);
			if (expiresIn) {
				pipeline.setex(uid, expiresIn, id);
			} else {
				pipeline.set(uid, id);
			}
		}

		// userCode 보조 인덱스 (Device Flow용)
		if (payload.userCode) {
			const uc = userCodeKey(this.modelType, payload.userCode);
			if (expiresIn) {
				pipeline.setex(uc, expiresIn, id);
			} else {
				pipeline.set(uc, id);
			}
		}

		// grantId SET 인덱스 (Grant 일괄 삭제용)
		if (payload.grantId) {
			const gk = grantKey(this.modelType, payload.grantId);
			pipeline.sadd(gk, id);
			if (expiresIn) {
				pipeline.expire(gk, expiresIn);
			}
		}

		await pipeline.exec();
	}

	async find(id: string): Promise<AdapterPayload | undefined> {
		const data = await this.redisService.get(key(this.modelType, id));
		if (!data) return undefined;
		return JSON.parse(data) as AdapterPayload;
	}

	async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
		const id = await this.redisService.get(
			userCodeKey(this.modelType, userCode),
		);
		if (!id) return undefined;
		return this.find(id);
	}

	async findByUid(uid: string): Promise<AdapterPayload | undefined> {
		const id = await this.redisService.get(uidKey(this.modelType, uid));
		if (!id) return undefined;
		return this.find(id);
	}

	async destroy(id: string): Promise<void> {
		const mainKey = key(this.modelType, id);
		const data = await this.redisService.get(mainKey);

		if (data) {
			const payload = JSON.parse(data) as AdapterPayload;
			const client = this.redisService.getClient();
			const pipeline = client.pipeline();

			pipeline.del(mainKey);

			if (payload.uid) {
				pipeline.del(uidKey(this.modelType, payload.uid));
			}
			if (payload.userCode) {
				pipeline.del(userCodeKey(this.modelType, payload.userCode));
			}
			if (payload.grantId) {
				pipeline.srem(grantKey(this.modelType, payload.grantId), id);
			}

			await pipeline.exec();
		} else {
			await this.redisService.del(mainKey);
		}
	}

	async revokeByGrantId(grantId: string): Promise<void> {
		const gk = grantKey(this.modelType, grantId);
		const client = this.redisService.getClient();
		const members = await client.smembers(gk);

		if (members.length === 0) return;

		const pipeline = client.pipeline();

		for (const id of members) {
			const mainKey = key(this.modelType, id);
			const data = await this.redisService.get(mainKey);
			pipeline.del(mainKey);

			if (data) {
				const payload = JSON.parse(data) as AdapterPayload;
				if (payload.uid) {
					pipeline.del(uidKey(this.modelType, payload.uid));
				}
				if (payload.userCode) {
					pipeline.del(userCodeKey(this.modelType, payload.userCode));
				}
			}
		}

		pipeline.del(gk);
		await pipeline.exec();
	}

	async consume(id: string): Promise<void> {
		const mainKey = key(this.modelType, id);
		const client = this.redisService.getClient();
		const data = await this.redisService.get(mainKey);

		if (data) {
			const payload = JSON.parse(data) as AdapterPayload;
			payload.consumed = Math.floor(Date.now() / 1000);

			// TTL 유지하면서 payload 업데이트
			const ttl = await client.ttl(mainKey);
			if (ttl > 0) {
				await client.setex(mainKey, ttl, JSON.stringify(payload));
			} else {
				await client.set(mainKey, JSON.stringify(payload));
			}
		}
	}
}

/**
 * Redis Adapter Factory
 *
 * oidc-provider가 각 모델 타입별로 어댑터 인스턴스를 생성할 때 사용.
 * RedisService를 주입받아 RedisOidcAdapter에 전달합니다.
 */
@Injectable()
export class RedisOidcAdapterFactory {
	constructor(private readonly redisService: RedisService) {}

	getAdapterFactory(): (modelType: string) => OidcAdapter {
		return (modelType: string) =>
			new RedisOidcAdapter(modelType, this.redisService);
	}
}
