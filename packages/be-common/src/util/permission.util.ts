import { SYSTEM_ROLES } from "@cocrepo/constant";
import type { ContextTenantSnapshot } from "@cocrepo/type";
import { SpaceCategoryName } from "@cocrepo/enum";

type TenantWithSpaceCategory = ContextTenantSnapshot & {
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

function resolveTenantSpaceCategoryName(tenant: ContextTenantSnapshot): string | undefined {
	const tenantWithSpaceCategory = tenant as TenantWithSpaceCategory;
	return (
		tenantWithSpaceCategory.space?.classification?.category?.name ??
		tenantWithSpaceCategory.space?.spaceClassification?.category?.name ??
		tenantWithSpaceCategory.space?.spaceClassifications?.[0]?.category?.name ??
		undefined
	);
}

export function resolveTenantSpaceId(tenant: ContextTenantSnapshot): string | undefined {
	return tenant.space?.id ?? tenant.spaceId ?? undefined;
}

/**
 * 현재 선택된 Tenant가 System(ROOT) Space인지 확인합니다.
 */
export function isRootSpaceCategory(tenant: ContextTenantSnapshot): boolean {
	return resolveTenantSpaceCategoryName(tenant) === SpaceCategoryName.ROOT.name;
}

/**
 * 현재 x-tenant-id에 대응하는 Tenant를 고릅니다.
 */
export function resolveCurrentTenantById(
	tenants: ContextTenantSnapshot[] | null | undefined,
	tenantId?: string,
): ContextTenantSnapshot | undefined {
	if (!tenants?.length) {
		return undefined;
	}
	if (!tenantId) {
		return undefined;
	}

	return tenants.find(
		(tenant) => tenant.id === tenantId && tenant.removedAt == null,
	);
}

/**
 * 모든 Space 데이터에 접근 가능한지 확인
 * 현재 선택된 Tenant role이 PLATFORM_ADMIN인 경우 전체 조회를 허용합니다.
 */
export function canAccessAllSpaces(tenant: ContextTenantSnapshot): boolean {
	return tenant.role?.name === SYSTEM_ROLES.PLATFORM_ADMIN;
}
