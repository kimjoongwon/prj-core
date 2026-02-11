import { CONTEXT_KEYS } from "@cocrepo/constant";
import { TenantDto, UserDto } from "@cocrepo/dto";
import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { parseAcceptLanguage } from "@cocrepo/toolkit";
import { SpacesRepository } from "@cocrepo/repository";
import { RedisService } from "@cocrepo/service";
import { ClsService } from "nestjs-cls";
import { AppLogger } from "../util/app-logger.util";

/** Space 하위 계층 캐시 TTL (10분) */
const DESCENDANT_SPACE_CACHE_TTL = 600;
/** Redis 캐시 키 접두사 */
const DESCENDANT_SPACE_CACHE_PREFIX = "space:descendants:";

/**
 * CLS 컨텍스트를 설정하는 Middleware
 *
 * Guard 이전에 실행되어, Guard에서 CLS를 통해 tenant/role 정보에 접근 가능
 * AuthMiddleware가 먼저 실행되어 request.user가 설정된 상태에서 동작
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
	private readonly logger = new AppLogger(RequestContextMiddleware.name);

	constructor(
		private readonly cls: ClsService,
		private readonly spacesRepository: SpacesRepository,
		private readonly redisService: RedisService,
	) {}

	async use(req: Request, _res: Response, next: NextFunction) {
		try {
			await this.setRequestContext(req);
		} catch (error) {
			this.logger.error(
				`Request 컨텍스트 설정 실패: ${error instanceof Error ? error?.message : String(error)}`,
			);

			// 예상치 못한 에러가 발생해도 기본값으로 설정하여 요청이 계속 진행되도록 함
			this.cls.set(CONTEXT_KEYS.AUTH_USER, undefined);
			this.cls.set(CONTEXT_KEYS.USER_ID, undefined);
			this.setUndefinedDefaults();
		}

		next();
	}

	private async setRequestContext(request: Request): Promise<void> {
		const user = request.user as UserDto;

		// User 설정
		if (user) {
			this.cls.set(CONTEXT_KEYS.AUTH_USER, user);
			this.cls.set(CONTEXT_KEYS.USER_ID, user.id);
		} else {
			this.cls.set(CONTEXT_KEYS.AUTH_USER, undefined);
			this.cls.set(CONTEXT_KEYS.USER_ID, undefined);
		}

		// 언어 설정 (Accept-Language 또는 x-language 헤더)
		const languageFromHeader =
			(request.headers["x-language"] as string | undefined) ||
			(request.headers["accept-language"] as string | undefined);

		const language = parseAcceptLanguage(languageFromHeader);
		this.cls.set(CONTEXT_KEYS.LANGUAGE, language);

		// Space ID 설정
		const spaceIdFromHeader = request.headers["x-space-id"] as
			| string
			| undefined;

		this.cls.set(CONTEXT_KEYS.SPACE_ID, spaceIdFromHeader || undefined);

		// Tenant 설정 (spaceId가 있는 경우에만)
		if (
			!spaceIdFromHeader ||
			!user?.tenants ||
			!Array.isArray(user.tenants)
		) {
			this.setUndefinedDefaults();
			return;
		}

		// spaceId로 해당 tenant 찾기
		const tenant = user.tenants.find(
			(t: TenantDto) => t.spaceId === spaceIdFromHeader,
		);

		// Tenant 설정
		this.cls.set(CONTEXT_KEYS.TENANT, tenant);

		// 사용자의 전체 tenant spaceIds를 접근 가능 Space ID 배열로 설정
		const accessibleSpaceIds = Array.from(
			new Set(user.tenants.map((t: TenantDto) => t.spaceId)),
		);
		this.cls.set(CONTEXT_KEYS.ACCESSIBLE_SPACE_IDS, accessibleSpaceIds);

		// 역할 정보 설정 (현재 Tenant 기반)
		this.setRoleContext(tenant);

		// 이용자 속성 정보 설정 (User 기반)
		this.setUserAttributeContext(user);

		// Space 하위 계층 ID 설정 (Redis 캐시)
		await this.setDescendantSpaceIds(spaceIdFromHeader);

		if (tenant) {
			this.logger.dev("Request 컨텍스트 설정 완료", {
				userId: user.id,
				spaceId: spaceIdFromHeader.slice(-8),
				tenantId: tenant.id.slice(-8),
				accessibleSpaces: accessibleSpaceIds.length,
				roleName: this.cls.get(CONTEXT_KEYS.ROLE_NAME),
				roleCategory: this.cls.get(CONTEXT_KEYS.ROLE_CATEGORY),
				language,
			});
		}
	}

	/**
	 * 역할 정보를 CLS 컨텍스트에 설정
	 */
	private setRoleContext(tenant: TenantDto | undefined): void {
		if (!tenant?.role) {
			this.cls.set(CONTEXT_KEYS.ROLE_NAME, undefined);
			this.cls.set(CONTEXT_KEYS.ROLE_CATEGORY, undefined);
			this.cls.set(CONTEXT_KEYS.ROLE_GROUP_NAMES, undefined);
			return;
		}

		this.cls.set(CONTEXT_KEYS.ROLE_NAME, tenant.role.name);

		// 역할 카테고리
		const roleCategory =
			tenant.role.classification?.category?.name ?? undefined;
		this.cls.set(CONTEXT_KEYS.ROLE_CATEGORY, roleCategory);

		// 역할 그룹 이름 배열
		const roleGroupNames =
			tenant.role.associations
				?.map((ac: any) => ac.group?.name)
				.filter(Boolean) ?? [];
		this.cls.set(CONTEXT_KEYS.ROLE_GROUP_NAMES, roleGroupNames);
	}

	/**
	 * 이용자 속성 정보를 CLS 컨텍스트에 설정
	 */
	private setUserAttributeContext(user: UserDto): void {
		// 이용자 카테고리
		const userClassification = (user as any).classification;
		const userCategory = userClassification?.category?.name ?? undefined;
		const userCategoryId = userClassification?.categoryId ?? undefined;
		this.cls.set(CONTEXT_KEYS.USER_CATEGORY, userCategory);
		this.cls.set(CONTEXT_KEYS.USER_CATEGORY_ID, userCategoryId);

		// 이용자 그룹
		const userAssociations = (user as any).associations;
		if (Array.isArray(userAssociations)) {
			const userGroupIds = userAssociations
				.map((a: any) => a.groupId)
				.filter(Boolean);
			const userGroupNames = userAssociations
				.map((a: any) => a.group?.name)
				.filter(Boolean);
			this.cls.set(CONTEXT_KEYS.USER_GROUP_IDS, userGroupIds);
			this.cls.set(CONTEXT_KEYS.USER_GROUP_NAMES, userGroupNames);
		} else {
			this.cls.set(CONTEXT_KEYS.USER_GROUP_IDS, []);
			this.cls.set(CONTEXT_KEYS.USER_GROUP_NAMES, []);
		}
	}

	/**
	 * Space 카테고리 계층 기반 하위 Space ID 배열을 설정 (Redis 캐시 활용)
	 */
	private async setDescendantSpaceIds(spaceId: string): Promise<void> {
		const cacheKey = `${DESCENDANT_SPACE_CACHE_PREFIX}${spaceId}`;

		try {
			// Redis 캐시 조회
			const cached = await this.redisService.get(cacheKey);
			if (cached) {
				const descendantIds = JSON.parse(cached) as string[];
				this.cls.set(CONTEXT_KEYS.DESCENDANT_SPACE_IDS, descendantIds);
				return;
			}

			// 캐시 미스 → DB 조회
			const descendantIds =
				await this.spacesRepository.findSpaceIdsByCategoryHierarchy(
					spaceId,
				);

			// Redis 캐시 저장 (TTL 10분)
			await this.redisService.set(
				cacheKey,
				JSON.stringify(descendantIds),
				DESCENDANT_SPACE_CACHE_TTL,
			);

			this.cls.set(CONTEXT_KEYS.DESCENDANT_SPACE_IDS, descendantIds);
		} catch (error) {
			this.logger.error(
				`Space 하위 계층 조회 실패: ${error instanceof Error ? error.message : String(error)}`,
			);
			// 실패 시 현재 spaceId만 포함
			this.cls.set(CONTEXT_KEYS.DESCENDANT_SPACE_IDS, [spaceId]);
		}
	}

	/**
	 * Tenant/역할/이용자 관련 컨텍스트를 모두 undefined로 초기화
	 */
	private setUndefinedDefaults(): void {
		this.cls.set(CONTEXT_KEYS.TENANT, undefined);
		this.cls.set(CONTEXT_KEYS.ACCESSIBLE_SPACE_IDS, undefined);
		this.cls.set(CONTEXT_KEYS.DESCENDANT_SPACE_IDS, undefined);
		this.cls.set(CONTEXT_KEYS.ROLE_NAME, undefined);
		this.cls.set(CONTEXT_KEYS.ROLE_CATEGORY, undefined);
		this.cls.set(CONTEXT_KEYS.ROLE_GROUP_NAMES, undefined);
		this.cls.set(CONTEXT_KEYS.USER_CATEGORY, undefined);
		this.cls.set(CONTEXT_KEYS.USER_CATEGORY_ID, undefined);
		this.cls.set(CONTEXT_KEYS.USER_GROUP_IDS, undefined);
		this.cls.set(CONTEXT_KEYS.USER_GROUP_NAMES, undefined);
	}
}
