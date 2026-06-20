import type { UpdateSecurityPolicyDto } from "@cocrepo/dto";
import type { SecurityPolicy } from "@cocrepo/entity";
import { SecurityPoliciesRepository } from "@cocrepo/repository";
import { RedisService } from "@cocrepo/service";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CACHE_KEY } from "./cache-key";
import { CACHE_TTL_SEC } from "./cache-ttl-sec";

/**
 * 보안 정책 서비스
 *
 * 시스템 전역 보안 정책을 관리합니다.
 * Redis 캐시를 사용하여 빈번한 DB 조회를 방지합니다.
 */
@Injectable()
export class SecurityPolicyAggregate {
	private readonly logger = new Logger(SecurityPolicyAggregate.name);

	constructor(
		private readonly repository: SecurityPoliciesRepository,
		private readonly redisService: RedisService,
	) {}

	/**
	 * 기본 보안 정책을 조회합니다 (Redis 캐시 활용)
	 */
	async getDefault(): Promise<SecurityPolicy> {
		this.logger.debug("기본 보안 정책 조회");

		// 캐시 확인
		const cached = await this.redisService.get(CACHE_KEY);
		if (cached) {
			this.logger.debug("캐시에서 보안 정책 반환");
			return JSON.parse(cached) as SecurityPolicy;
		}

		// DB 조회
		const policy = await this.repository.findByKey("default");
		if (!policy) {
			throw new NotFoundException("기본 보안 정책을 찾을 수 없습니다");
		}

		// 캐시 저장
		await this.redisService.set(
			CACHE_KEY,
			JSON.stringify(policy),
			CACHE_TTL_SEC,
		);

		return policy;
	}

	/**
	 * 보안 정책을 수정합니다
	 */
	async update(dto: UpdateSecurityPolicyDto): Promise<SecurityPolicy> {
		this.logger.debug("보안 정책 수정");

		const existing = await this.repository.findByKey("default");
		if (!existing) {
			throw new NotFoundException("기본 보안 정책을 찾을 수 없습니다");
		}

		const updated = await this.repository.updateByKey("default", dto);

		// 캐시 무효화
		await this.redisService.del(CACHE_KEY);

		return updated;
	}
}
