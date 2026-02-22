import type { TenantDto } from "@cocrepo/dto";
import { SpaceCategoryName } from "@cocrepo/enum";

/**
 * Space가 ROOT 카테고리인지 확인
 * ROOT 카테고리 Space는 모든 하위 카테고리 Space 데이터에 접근 가능
 */
export function isRootSpaceCategory(tenant: TenantDto): boolean {
	const categoryName = tenant.space?.spaceClassification?.category?.name;
	return categoryName === SpaceCategoryName.ROOT.name;
}

/**
 * 모든 Space 데이터에 접근 가능한지 확인
 * SpaceCategory가 ROOT이면 하위 모든 Space 접근 가능
 */
export function canAccessAllSpaces(tenant: TenantDto): boolean {
	return isRootSpaceCategory(tenant);
}
