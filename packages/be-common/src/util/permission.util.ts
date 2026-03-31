import { SYSTEM_ROLES } from "@cocrepo/constant";
import type { TenantDto } from "@cocrepo/dto";

/**
 * 이전 ROOT category 기반 전체 접근 체크와의 호환용 별칭입니다.
 * 현재 전체 접근 여부는 선택된 Tenant의 FULL_ACCESS 역할로 판단합니다.
 */
export function isRootSpaceCategory(tenant: TenantDto): boolean {
	return tenant.role?.name === SYSTEM_ROLES.FULL_ACCESS;
}

/**
 * 모든 Space 데이터에 접근 가능한지 확인
 * 현재 선택된 Tenant의 role이 FULL_ACCESS인 경우 전체 조회를 허용합니다.
 */
export function canAccessAllSpaces(tenant: TenantDto): boolean {
	return tenant.role?.name === SYSTEM_ROLES.FULL_ACCESS;
}
