import type { SecurityPolicy } from "@cocrepo/entity";
import { SecurityPoliciesRepository } from "@cocrepo/repository";
import { RedisService } from "@cocrepo/service";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CACHE_KEY } from "./cache-key";
import { CACHE_TTL_SEC } from "./cache-ttl-sec";

@Injectable()
export class SecurityPolicyAggregate {
	private readonly logger = new Logger(SecurityPolicyAggregate.name);

	constructor(
		private readonly repository: SecurityPoliciesRepository,
		private readonly redisService: RedisService,
	) {}

	async getDefault(): Promise<SecurityPolicy> {
		this.logger.debug("기본 보안 정책 조회");

		const cached = await this.redisService.get(CACHE_KEY);
		if (cached) {
			return JSON.parse(cached) as SecurityPolicy;
		}

		const policy = await this.repository.findByKey("default");
		if (!policy) {
			throw new NotFoundException("기본 보안 정책을 찾을 수 없습니다");
		}

		await this.redisService.set(
			CACHE_KEY,
			JSON.stringify(policy),
			CACHE_TTL_SEC,
		);

		return policy;
	}
}
