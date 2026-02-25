import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { TenantDto } from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { AuthContext } from "./auth-context";

/**
 * Space 컨텍스트
 *
 * AuthContext와 연동하여 Space 관련 접근 권한을 제공합니다.
 *
 * @example
 * constructor(private readonly spaceCtx: SpaceContext) {}
 *
 * async getGrounds() {
 *   return this.repository.findMany({
 *     where: this.spaceCtx.spaceFilter,
 *   });
 * }
 */
@Injectable()
export class SpaceContext {
	constructor(
		private readonly cls: ClsService,
		private readonly authCtx: AuthContext,
	) {}

	/** 현재 요청의 Space ID (X-Space-ID 헤더) */
	get spaceId(): string | undefined {
		return this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
	}

	/** 현재 TenantDto */
	get tenant(): TenantDto | undefined {
		return this.cls.get<TenantDto>(CONTEXT_KEYS.TENANT);
	}

	// ═══════════════════════════════════════════════════════════
	// 쿼리 필터용 Space IDs
	// AuthContext에서 가져옴 (중복 제거)
	// ═══════════════════════════════════════════════════════════

	/**
	 * 쿼리 필터용 Space IDs
	 * - 슈퍼매니저: undefined → 전체 조회
	 * - 일반: tenants의 spaceIds
	 */
	get spaceIds(): string[] | undefined {
		return this.authCtx.accessibleSpaceIds;
	}

	/**
	 * Prisma Where 절용 Space 필터
	 * undefined면 전체, * 필터 없음)
	 * { spaceId: { in: [...] } } 형태
	 */
	get spaceFilter(): { spaceId: { in: string[] } } | undefined {
		const ids = this.spaceIds;
		return ids ? { spaceId: { in: ids } } : undefined;
	}

	/**
	 * 특정 Space 접근 권한
	 */
	canAccessSpace(spaceId: string): boolean {
		return this.authCtx.canAccessSpace(spaceId);
	}
}
