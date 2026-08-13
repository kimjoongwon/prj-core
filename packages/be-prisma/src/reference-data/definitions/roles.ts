import { RoleCategoryName, RoleGroupName } from "@cocrepo/enum";

/**
 * 역할 기준 데이터입니다.
 *
 * 카테고리, 그룹, 역할, 분류, 연결이 여러 배열로 나뉘어 있지만 결국 하나의 권한 모델을
 * 구성합니다. runtime sync는 각 배열의 business key를 기준으로 upsert/연결합니다.
 */

// Role 타입 카테고리 시드 데이터 (RoleCategoryName enum 활용)
export interface CategorySeedData {
	roleCategoryEnum: RoleCategoryName;
	parentId?: string;
}

// 카테고리 enum은 UI 분류와 권한 정책 양쪽에서 공통으로 쓰이는 고정 키입니다.
export const roleCategorySeedData: CategorySeedData[] = [
	{
		roleCategoryEnum: RoleCategoryName.PLATFORM,
	},
	{
		roleCategoryEnum: RoleCategoryName.SHARED,
	},
	{
		roleCategoryEnum: RoleCategoryName.PUBLIC,
	},
	{
		roleCategoryEnum: RoleCategoryName.WORKSPACE,
	},
	{
		roleCategoryEnum: RoleCategoryName.PROJECT,
	},
];

// Role 시드 데이터 (role.prisma의 Role 모델에 대응)
export interface RoleSeedData {
	name: string;
	displayName: string;
	description: string;
}

// Role의 실제 식별자는 `name`이며, displayName/description은 운영 중 보정 가능한 표현값입니다.
export const roleSeedData: RoleSeedData[] = [
	{
		name: "PLATFORM_ADMIN",
		displayName: "플랫폼 관리자",
		description:
			"플랫폼 전체를 운영하고 모든 Space와 시스템 리소스에 접근하는 역할",
	},
	{
		name: "COMPANY_MANAGER",
		displayName: "Company 관리자",
		description:
			"특정 Company의 지점, 회원, 예약, 콘텐츠 등 운영 리소스를 관리하는 역할",
	},
	{
		name: "MEMBER",
		displayName: "회원",
		description: "자신의 정보와 예약을 관리하고 시설/콘텐츠를 조회하는 역할",
	},
];

// RoleClassification은 "역할 자체"와 "역할이 속한 카테고리"를 매핑하는 기준 테이블 정의입니다.

export interface RoleClassificationSeedData {
	roleName: string;
	roleCategoryEnum: RoleCategoryName; // RoleCategoryName enum 사용
}

// roleName + roleCategoryEnum 조합이 연결의 의미를 결정합니다.
export const roleClassificationSeedData: RoleClassificationSeedData[] = [
	{
		roleName: "PLATFORM_ADMIN",
		roleCategoryEnum: RoleCategoryName.PLATFORM, // "플랫폼" 카테고리
	},
	{
		roleName: "COMPANY_MANAGER",
		roleCategoryEnum: RoleCategoryName.WORKSPACE, // "워크스페이스" 카테고리
	},
	{
		roleName: "MEMBER",
		roleCategoryEnum: RoleCategoryName.WORKSPACE, // "워크스페이스" 카테고리
	},
];

export interface RoleGroupSeedData {
	roleGroupEnum: RoleGroupName;
}

// Group은 멤버십/패키징 같은 상위 개념으로 Role을 묶을 때 쓰는 분류 축입니다.
export const roleGroupSeedData: RoleGroupSeedData[] = [
	{
		roleGroupEnum: RoleGroupName.TRUSTED,
	},
	{
		roleGroupEnum: RoleGroupName.STANDARD,
	},
	{
		roleGroupEnum: RoleGroupName.PREMIUM,
	},
];

// RoleAssociation은 역할과 그룹 사이의 연결 정의입니다.
export interface RoleAssociationSeedData {
	roleName: string;
	roleGroupEnum: RoleGroupName;
}

// 이 연결은 권한 자체를 만들지는 않고, 역할을 어떤 상품/플랜 축에 올릴지 결정합니다.
export const roleAssociationSeedData: RoleAssociationSeedData[] = [
	// PLATFORM_ADMIN은 TRUSTED 그룹
	{
		roleName: "PLATFORM_ADMIN",
		roleGroupEnum: RoleGroupName.TRUSTED,
	},
	// COMPANY_MANAGER는 PREMIUM 그룹
	{
		roleName: "COMPANY_MANAGER",
		roleGroupEnum: RoleGroupName.PREMIUM,
	},
	// MEMBER는 STANDARD 그룹
	{
		roleName: "MEMBER",
		roleGroupEnum: RoleGroupName.STANDARD,
	},
];
