import { SYSTEM_ROLES, SYSTEM_SPACE } from "@cocrepo/constant";
import type { TenantDto } from "@cocrepo/dto";

/**
 * System Space 여부 확인
 * seq=1인 Space는 시스템 관리용 Space
 */
export function isSystemSpace(space: { seq: number }): boolean {
	return space.seq === SYSTEM_SPACE.SEQ;
}

/**
 * System Space에 속한 Tenant인지 확인
 */
export function isSystemTenant(tenant: TenantDto): boolean {
	return tenant.space?.seq === SYSTEM_SPACE.SEQ;
}

/**
 * 모든 Space 데이터에 접근 가능한지 확인
 * SUPER_ADMIN role을 가진 경우에만 true
 */
export function canAccessAllSpaces(tenant: TenantDto): boolean {
	return tenant.role?.name === SYSTEM_ROLES.SUPER_ADMIN;
}
