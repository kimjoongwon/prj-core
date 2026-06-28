import { OidcDirectUsersRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import {
	ACCOUNT_CACHE_PREFIX,
	ACCOUNT_CACHE_TTL,
} from "./account-cache.constants";
import type { TenantWithRelations } from "./tenant-with-relations.type";
import type { Account, AccountClaims, FindAccount } from "./types";

/**
 * OIDC Account Service
 *
 * oidc-provider가 사용자 정보를 조회할 때 사용합니다.
 * Redis 캐시를 활용하여 반복적인 DB 조회를 방지합니다.
 */
@Injectable()
export class AccountService {
	private readonly logger = new Logger(AccountService.name);

	constructor(
		private readonly directUserRepository: OidcDirectUsersRepository,
		private readonly redisService: RedisService,
	) {}

	/**
	 * oidc-provider의 findAccount 함수 구현
	 * Authorization Flow에서 사용자 정보를 조회할 때 호출됩니다.
	 */
	findAccount: FindAccount = async (_ctx, id, _token) => {
		this.logger.debug(`Finding account for id: ${id}`);

		const account: Account = {
			accountId: id,
			claims: async (
				_use,
				scope,
				_claims,
				_rejected,
			): Promise<AccountClaims> => {
				return this.getClaims(id, scope);
			},
		};

		return account;
	};

	/**
	 * 사용자 claims 조회 (Redis 캐시 활용)
	 * 캐시 히트 시 DB 쿼리를 스킵합니다.
	 */
	private async getClaims(
		userId: string,
		scope: string,
	): Promise<AccountClaims> {
		const cacheKey = `${ACCOUNT_CACHE_PREFIX}:${userId}`;

		// 캐시 히트 확인
		const cached = await this.redisService.get(cacheKey);
		if (cached) {
			this.logger.debug(`Account cache hit: ${userId}`);
			const fullClaims = JSON.parse(cached) as AccountClaims;
			return this.filterClaimsByScope(fullClaims, scope);
		}

		// 캐시 미스 - DB 조회
		this.logger.debug(`Account cache miss: ${userId}`);
		const user = await this.directUserRepository.findByIdWithTenants(userId);

		if (!user) {
			this.logger.debug(`User not found: ${userId}`);
			return { sub: userId };
		}

		// 전체 scope 기준으로 claims 빌드 후 캐시 저장
		const fullClaims = this.buildFullClaims(user);
		await this.redisService.set(
			cacheKey,
			JSON.stringify(fullClaims),
			ACCOUNT_CACHE_TTL,
		);

		return this.filterClaimsByScope(fullClaims, scope);
	}

	/**
	 * 사용자 정보로부터 전체 claims 빌드
	 */
	private buildFullClaims(user: {
		id: string;
		name: string;
		email: string;
		phone: string;
		createdAt: Date;
		updatedAt: Date | null;
		tenants?: unknown[];
	}): AccountClaims {
		const tenants = user.tenants as unknown as TenantWithRelations[];

		return {
			sub: user.id,
			name: user.name,
			updated_at: user.updatedAt
				? Math.floor(user.updatedAt.getTime() / 1000)
				: Math.floor(user.createdAt.getTime() / 1000),
			email: user.email,
			email_verified: true,
			phone_number: user.phone,
			phone_number_verified: true,
			roles: tenants?.map((t) => ({
				spaceId: t.spaceId,
				roleId: t.roleId,
				roleName: t.role?.name,
				roleDisplayName: t.role?.displayName,
				isSystemRole: t.role?.isSystem,
			})),
			spaces: tenants?.map((t) => {
				const primaryGround = t.space?.company?.ground;
				return {
					spaceId: t.spaceId,
					groundName: primaryGround?.name,
				};
			}),
		};
	}

	/**
	 * scope에 따라 claims 필터링
	 */
	private filterClaimsByScope(
		fullClaims: AccountClaims,
		scope: string,
	): AccountClaims {
		const scopeArray = scope.split(" ");
		const result: AccountClaims = { sub: fullClaims.sub as string };

		if (scopeArray.includes("profile")) {
			result.name = fullClaims.name;
			result.updated_at = fullClaims.updated_at;
		}

		if (scopeArray.includes("email")) {
			result.email = fullClaims.email;
			result.email_verified = fullClaims.email_verified;
		}

		if (scopeArray.includes("phone")) {
			result.phone_number = fullClaims.phone_number;
			result.phone_number_verified = fullClaims.phone_number_verified;
		}

		if (scopeArray.includes("roles")) {
			result.roles = fullClaims.roles;
			result.spaces = fullClaims.spaces;
		}

		return result;
	}
}
