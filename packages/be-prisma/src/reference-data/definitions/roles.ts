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
	type: "Role" | "Space" | "Asset" | "User";
	parentId?: string;
}

// 카테고리 enum은 UI 분류와 권한 정책 양쪽에서 공통으로 쓰이는 고정 키입니다.
export const roleCategorySeedData: CategorySeedData[] = [
	{
		roleCategoryEnum: RoleCategoryName.PLATFORM,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryName.SHARED,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryName.PUBLIC,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryName.WORKSPACE,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryName.PROJECT,
		type: "Role",
	},
];

// Role 시드 데이터 (role.prisma의 Role 모델에 대응)
export interface RoleSeedData {
	name: string;
	displayName: string;
	description: string;
	isSystem: boolean;
}

// Role의 실제 식별자는 `name`이며, displayName/description은 운영 중 보정 가능한 표현값입니다.
export const roleSeedData: RoleSeedData[] = [
	{
		name: "FULL_ACCESS",
		displayName: "전체 접근",
		description: "시스템의 모든 권한을 가진 전체 접근 역할",
		isSystem: true,
	},
	{
		name: "MANAGE",
		displayName: "관리",
		description: "관리 업무를 수행하는 역할",
		isSystem: true,
	},
	{
		name: "VIEW",
		displayName: "조회",
		description: "기본 조회 역할",
		isSystem: true,
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
		roleName: "FULL_ACCESS",
		roleCategoryEnum: RoleCategoryName.PLATFORM, // "플랫폼" 카테고리
	},
	{
		roleName: "MANAGE",
		roleCategoryEnum: RoleCategoryName.WORKSPACE, // "워크스페이스" 카테고리
	},
	{
		roleName: "VIEW",
		roleCategoryEnum: RoleCategoryName.PUBLIC, // "공개" 카테고리
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
	// FULL_ACCESS는 TRUSTED 그룹
	{
		roleName: "FULL_ACCESS",
		roleGroupEnum: RoleGroupName.TRUSTED,
	},
	// MANAGE는 PREMIUM 그룹
	{
		roleName: "MANAGE",
		roleGroupEnum: RoleGroupName.PREMIUM,
	},
	// VIEW는 STANDARD 그룹
	{
		roleName: "VIEW",
		roleGroupEnum: RoleGroupName.STANDARD,
	},
];
