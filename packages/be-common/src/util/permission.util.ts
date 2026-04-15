import { SYSTEM_ROLES } from "@cocrepo/constant";
import { SpaceCategoryName } from "@cocrepo/enum";
import type { TenantDto } from "@cocrepo/dto";

type TenantWithSpaceCategory = TenantDto & {
	space?: {
		classification?: {
			category?: {
				name?: string | null;
			} | null;
		} | null;
		spaceClassification?: {
			category?: {
				name?: string | null;
			} | null;
		} | null;
		spaceClassifications?: Array<{
			category?: {
				name?: string | null;
			} | null;
		}> | null;
	} | null;
};

function resolveTenantSpaceCategoryName(tenant: TenantDto): string | undefined {
	const tenantWithSpaceCategory = tenant as TenantWithSpaceCategory;
	return (
		tenantWithSpaceCategory.space?.classification?.category?.name ??
		tenantWithSpaceCategory.space?.spaceClassification?.category?.name ??
		tenantWithSpaceCategory.space?.spaceClassifications?.[0]?.category?.name ??
		undefined
	);
}

/**
 * 현재 선택된 Tenant가 System(ROOT) Space인지 확인합니다.
 */
export function isRootSpaceCategory(tenant: TenantDto): boolean {
	return resolveTenantSpaceCategoryName(tenant) === SpaceCategoryName.ROOT.name;
}

/**
 * 모든 Space 데이터에 접근 가능한지 확인
 * 현재 선택된 Tenant가 FULL_ACCESS 이면서 System(ROOT) Space인 경우에만 전체 조회를 허용합니다.
 */
export function canAccessAllSpaces(tenant: TenantDto): boolean {
	return (
		tenant.role?.name === SYSTEM_ROLES.FULL_ACCESS &&
		isRootSpaceCategory(tenant)
	);
}
