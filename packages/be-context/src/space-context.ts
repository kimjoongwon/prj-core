import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { ContextTenantSnapshot } from "@cocrepo/type";
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

	/** 현재 요청의 Tenant ID (x-tenant-id 헤더) */
	get tenantId(): string | undefined {
		return this.cls.get<string>(CONTEXT_KEYS.TENANT_ID);
	}

	/** 현재 요청 Tenant에서 파생된 Space ID */
	get spaceId(): string | undefined {
		return this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
	}

	/** 현재 ContextTenantSnapshot */
	get tenant(): ContextTenantSnapshot | undefined {
		return this.cls.get<ContextTenantSnapshot>(CONTEXT_KEYS.TENANT);
	}

	// ═══════════════════════════════════════════════════════════
	// 쿼리 필터용 Space IDs
	// CLS에서 직접 계산
	// ═══════════════════════════════════════════════════════════

	/**
	 * 쿼리 필터용 Space IDs
	 * - undefined: 필터 미적용이 명시적으로 허용된 내부 경로
	 * - [id1, id2, ...]: 현재 선택 Tenant의 Space category scope
	 */
	get spaceIds(): string[] | undefined {
		return this.cls.get<string[] | undefined>(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS);
	}

	/**
	 * Prisma Where 절용 Tenant 소유 리소스 필터
	 * undefined면 전체, * 필터 없음)
	 * { tenant: { spaceId: { in: [...] } } } 형태
	 */
	get spaceFilter():
		| { tenant: { spaceId: { in: string[] } } }
		| undefined {
		const ids = this.spaceIds;
		return ids ? { tenant: { spaceId: { in: ids } } } : undefined;
	}

	/**
	 * Prisma Where 절용 현재 Tenant 필터
	 * 생성/수정처럼 현재 선택 Tenant 하나에 묶어야 할 때 사용합니다.
	 */
	get tenantFilter(): { tenantId: string } | undefined {
		const tenantId = this.tenantId;
		return tenantId ? { tenantId } : undefined;
	}

	/**
	 * 특정 Space 접근 권한
	 */
	canAccessSpace(spaceId: string): boolean {
		const ids = this.spaceIds;
		return ids === undefined ? true : ids.includes(spaceId);
	}
}
