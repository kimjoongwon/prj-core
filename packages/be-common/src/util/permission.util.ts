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
 * 현재 x-space-id에 대응하는 Tenant를 고릅니다.
 */
export function resolveCurrentTenantForSpace(
	tenants: TenantDto[] | null | undefined,
	spaceId?: string,
): TenantDto | undefined {
	if (!tenants?.length) {
		return undefined;
	}

	if (!spaceId) {
		return tenants[0];
	}

	const matchedTenant = tenants.find((tenant) => tenant.spaceId === spaceId);
	if (!matchedTenant) {
		return undefined;
	}

	return matchedTenant;
}

/**
 * 모든 Space 데이터에 접근 가능한지 확인
 * 현재 선택된 Tenant role이 FULL_ACCESS인 경우 전체 조회를 허용합니다.
 */
export function canAccessAllSpaces(tenant: TenantDto): boolean {
	return tenant.role?.name === SYSTEM_ROLES.FULL_ACCESS;
}
