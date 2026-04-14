import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { TenantDto } from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";

/**
 * Space 컨텍스트
 *
 * CLS에 저장된 사용자/테넌트 정보를 기반으로 Space 관련 접근 권한을 제공합니다.
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
	constructor(private readonly cls: ClsService) {}

	/** 현재 요청의 Space ID (x-space-id 헤더) */
	get spaceId(): string | undefined {
		return this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
	}

	/** 현재 TenantDto */
	get tenant(): TenantDto | undefined {
		return this.cls.get<TenantDto>(CONTEXT_KEYS.TENANT);
	}

	// ═══════════════════════════════════════════════════════════
	// 쿼리 필터용 Space IDs
	// CLS에서 직접 계산
	// ═══════════════════════════════════════════════════════════

	/**
	 * 쿼리 필터용 Space IDs
	 * - undefined: 전체 조회 (FULL_ACCESS)
	 * - [id]: 현재 선택 Space만 조회
	 */
	get spaceIds(): string[] | undefined {
		return this.cls.get<string[] | undefined>(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS);
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
		const ids = this.spaceIds;
		return ids === undefined ? true : ids.includes(spaceId);
	}
}
