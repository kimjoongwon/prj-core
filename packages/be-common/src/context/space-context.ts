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
 *   const spaceIds = this.spaceCtx.spaceIds;
 *   return this.repository.findManyBySpaceIds({ ...params, spaceIds });
 * }
 * ```
 */
@Injectable()
export class SpaceContext {
	constructor(private readonly cls: ClsService) {}

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
	 * SpaceScopeInterceptor가 데코레이터 기반으로 계산한 값
	 */
	get spaceIds(): string[] {
		return this.cls.get<string[]>(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS) ?? [];
	}

	/** 특정 Space 접근 가능 여부 */
	hasAccessTo(targetSpaceId: string): boolean {
		return this.spaceIds.includes(targetSpaceId);
	}

	// === Prisma Where 헬퍼 ===

	/** 직접 spaceId FK 모델용 (Ground, Category, Group 등) */
	get spaceFilter(): { spaceId: { in: string[] } } {
		return { spaceId: { in: this.spaceIds } };
	}

	/** Tenant 관계 경유 모델용 (User) */
	get tenantSpaceFilter() {
		return {
			tenants: { some: { spaceId: { in: this.spaceIds }, removedAt: null } },
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
