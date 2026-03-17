import { RoleCategoryName, RoleGroupName } from "@cocrepo/enum";

// Role 타입 카테고리 시드 데이터 (RoleCategoryName enum 활용)
export interface CategorySeedData {
	roleCategoryEnum: RoleCategoryName;
	type: "Role" | "Space" | "Asset" | "User";
	parentId?: string;
}

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

// RoleClassification 시드 데이터 (Role과 Category type="Role" 연결)
// role.prisma의 RoleClassification 모델: categoryId, roleId로 연결

export interface RoleClassificationSeedData {
	roleName: string;
	roleCategoryEnum: RoleCategoryName; // RoleCategoryName enum 사용
}

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

// Role Group 시드 데이터 (RoleGroupName enum 활용)

export interface RoleGroupSeedData {
	roleGroupEnum: RoleGroupName;
}

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

// Role과 Group 연결 (RoleAssociation) 시드 데이터
export interface RoleAssociationSeedData {
	roleName: string;
	roleGroupEnum: RoleGroupName;
}

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
