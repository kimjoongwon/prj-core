import { SYSTEM_ROLES } from "@cocrepo/constant";
import type { TenantDto } from "@cocrepo/dto";
import { SpaceCategoryName } from "@cocrepo/enum";

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

export function resolveTenantSpaceId(tenant: TenantDto): string | undefined {
	return tenant.space?.id ?? tenant.spaceId ?? undefined;
}

/**
 * 현재 선택된 Tenant가 System(ROOT) Space인지 확인합니다.
 */
export function isRootSpaceCategory(tenant: TenantDto): boolean {
	return resolveTenantSpaceCategoryName(tenant) === SpaceCategoryName.ROOT.name;
}

/**
 * 현재 x-space-id에 대응하는 Tenant를 고릅니다.
 * 우선순위:
 * 1. 같은 spaceId + 제거되지 않은 레코드
 * 2. FULL_ACCESS 역할이 있으면 해당 tenant
 * 3. 그 외 첫 번째 tenant
 */
export function resolveCurrentTenantForSpace(
	tenants: TenantDto[] | null | undefined,
	spaceId?: string,
): TenantDto | undefined {
	if (!tenants?.length) {
		return undefined;
	}
	if (!spaceId) {
		return undefined;
	}

	const candidates = tenants.filter(
		(tenant) =>
			resolveTenantSpaceId(tenant) === spaceId && tenant.removedAt == null,
	);
	if (!candidates.length) {
		return undefined;
	}

	const fullAccessTenant = candidates.find(
		(tenant) => tenant.role?.name === SYSTEM_ROLES.FULL_ACCESS,
	);
	if (fullAccessTenant) {
		return fullAccessTenant;
	}

	return candidates[0];
}

/**
 * 모든 Space 데이터에 접근 가능한지 확인
 * 현재 선택된 Tenant role이 FULL_ACCESS인 경우 전체 조회를 허용합니다.
 */
export function canAccessAllSpaces(tenant: TenantDto): boolean {
	return tenant.role?.name === SYSTEM_ROLES.FULL_ACCESS;
}
