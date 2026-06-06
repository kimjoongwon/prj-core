import { RedisService } from "../redis/redis.service";
import type { AdapterPayload, OidcAdapter } from "./types";
import {
	oidcAdapterGrantKey,
	oidcAdapterKey,
	oidcAdapterUidKey,
	oidcAdapterUserCodeKey,
} from "./oidc-adapter-key";

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
		const mainKey = oidcAdapterKey(this.modelType, id);
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
			const uid = oidcAdapterUidKey(this.modelType, payload.uid);
			if (expiresIn) {
				pipeline.setex(uid, expiresIn, id);
			} else {
				pipeline.set(uid, id);
			}
		}

		// userCode 보조 인덱스 (Device Flow용)
		if (payload.userCode) {
			const uc = oidcAdapterUserCodeKey(this.modelType, payload.userCode);
			if (expiresIn) {
				pipeline.setex(uc, expiresIn, id);
			} else {
				pipeline.set(uc, id);
			}
		}

		// grantId SET 인덱스 (Grant 일괄 삭제용)
		if (payload.grantId) {
			const gk = oidcAdapterGrantKey(this.modelType, payload.grantId);
			pipeline.sadd(gk, id);
			if (expiresIn) {
				pipeline.expire(gk, expiresIn);
			}
		}

		await pipeline.exec();
	}

	async find(id: string): Promise<AdapterPayload | undefined> {
		const data = await this.redisService.get(oidcAdapterKey(this.modelType, id));
		if (!data) return undefined;
		return JSON.parse(data) as AdapterPayload;
	}

	async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
		const id = await this.redisService.get(
			oidcAdapterUserCodeKey(this.modelType, userCode),
		);
		if (!id) return undefined;
		return this.find(id);
	}

	async findByUid(uid: string): Promise<AdapterPayload | undefined> {
		const id = await this.redisService.get(
			oidcAdapterUidKey(this.modelType, uid),
		);
		if (!id) return undefined;
		return this.find(id);
	}

	async destroy(id: string): Promise<void> {
		const mainKey = oidcAdapterKey(this.modelType, id);
		const data = await this.redisService.get(mainKey);

		if (data) {
			const payload = JSON.parse(data) as AdapterPayload;
			const client = this.redisService.getClient();
			const pipeline = client.pipeline();

			pipeline.del(mainKey);

			if (payload.uid) {
				pipeline.del(oidcAdapterUidKey(this.modelType, payload.uid));
			}
			if (payload.userCode) {
				pipeline.del(
					oidcAdapterUserCodeKey(this.modelType, payload.userCode),
				);
			}
			if (payload.grantId) {
				pipeline.srem(oidcAdapterGrantKey(this.modelType, payload.grantId), id);
			}

			await pipeline.exec();
		} else {
			await this.redisService.del(mainKey);
		}
	}

	async revokeByGrantId(grantId: string): Promise<void> {
		const gk = oidcAdapterGrantKey(this.modelType, grantId);
		const client = this.redisService.getClient();
		const members = await client.smembers(gk);

		if (members.length === 0) return;

		const pipeline = client.pipeline();

		for (const id of members) {
			const mainKey = oidcAdapterKey(this.modelType, id);
			const data = await this.redisService.get(mainKey);
			pipeline.del(mainKey);

			if (data) {
				const payload = JSON.parse(data) as AdapterPayload;
				if (payload.uid) {
					pipeline.del(oidcAdapterUidKey(this.modelType, payload.uid));
				}
				if (payload.userCode) {
					pipeline.del(
						oidcAdapterUserCodeKey(this.modelType, payload.userCode),
					);
				}
			}
		}

		pipeline.del(gk);
		await pipeline.exec();
	}

	async consume(id: string): Promise<void> {
		const mainKey = oidcAdapterKey(this.modelType, id);
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
