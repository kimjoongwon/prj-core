import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { TenantDto } from "@cocrepo/dto";
import {
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { ClsService } from "nestjs-cls";

/**
 * Space 컨텍스트
 *
 * CLS에 저장된 Space 관련 값을 캡슐화하여
 * Service에서 보일러플레이트 없이 사용할 수 있게 합니다.
 *
 * @example
 * ```typescript
 * constructor(private readonly spaceCtx: SpaceContext) {}
 *
 * async getMembers(params) {
 *   // spaceFilter: undefined면 전체 조회, 아니면 필터링
 *   return this.repository.findMany({
 *     where: { ...this.spaceCtx.spaceFilter, ...otherFilters }
 *   });
 * }
 * ```
 */
@Injectable()
export class SpaceContext {
	constructor(private readonly cls: ClsService) { }

	/** 현재 요청의 Space ID (X-Space-ID 헤더) */
	get spaceId(): string | undefined {
		return this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
	}

	/** 현재 Tenant 정보 */
	get tenant(): TenantDto | undefined {
		return this.cls.get<TenantDto>(CONTEXT_KEYS.TENANT);
	}

	/**
	 * 쿼리 필터에 사용할 Space IDs
	 * SpaceScopeInterceptor가 계산한 값
	 *
	 * - undefined: 슈퍼매니저 (전체 조회)
	 * - []: 접근 가능한 Space 없음
	 * - [id1, id2, ...]: Tenant 기반 필터링
	 */
	get spaceIds(): string[] | undefined {
		return this.cls.get<string[]>(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS);
	}

	/** 특정 Space 접근 가능 여부 */
	hasAccessTo(targetSpaceId: string): boolean {
		const ids = this.spaceIds;
		// undefined (슈퍼매니저)면 모든 Space 접근 가능
		if (ids === undefined) return true;
		return ids.includes(targetSpaceId);
	}

	// === Prisma Where 헬퍼 ===

	/**
	 * 직접 spaceId FK 모델용 (Ground, Category, Group 등)
	 *
	 * - undefined 반환 시: 전체 조회 (where 조건 없음)
	 * - { spaceId: { in: [...] } } 반환 시: 필터링
	 */
	get spaceFilter(): { spaceId: { in: string[] } } | undefined {
		const ids = this.spaceIds;
		// undefined면 전체 조회 (필터 없음)
		if (ids === undefined) return undefined;
		return { spaceId: { in: ids } };
	}

	/** Tenant 관계 경유 모델용 (User) */
	get tenantSpaceFilter():
		| { tenants: { some: { spaceId: { in: string[] }; removedAt: null } } }
		| undefined {
		const ids = this.spaceIds;
		// undefined면 전체 조회 (필터 없음)
		if (ids === undefined) return undefined;
		return {
			tenants: { some: { spaceId: { in: ids }, removedAt: null } },
		};
	}

	/** Space 컨텍스트 미설정 시 InternalServerError */
	assertContextSet(): void {
		if (!this.spaceId) {
			throw new InternalServerErrorException(
				"Space 컨텍스트가 설정되지 않았습니다",
			);
		}
	}
}
