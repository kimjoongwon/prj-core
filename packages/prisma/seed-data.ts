// Enum imports
import { RoleCategoryNames } from "../src/enum/role-category-names.enum";
import { RoleGroupNames } from "../src/enum/role-group-names.enum";

// 시드 데이터를 위한 메타데이터
export interface UserSeedData {
	email: string;
	phone: string;
	password: string;
	profile: {
		name: string;
		nickname: string;
	};
	role?: "USER" | "ADMIN" | "SUPER_ADMIN";
}

export interface GroundSeedData {
	name: string;
	label: string;
	address: string;
	phone: string;
	email: string;
	businessNo: string;
}

// 10명의 다양한 역할 유저 데이터 (SUPER_ADMIN 1명, ADMIN 3명, USER 6명)
export const userSeedData: UserSeedData[] = [
	// SUPER_ADMIN 1명
	{
		email: "super-admin@gmail.com",
		phone: "01011000001",
		password: "superadmin123!@#",
		profile: {
			name: "슈퍼관리자",
			nickname: "슈퍼관리자",
		},
		role: "SUPER_ADMIN",
	},
	// ADMIN 3명
	...Array.from({ length: 3 }, (_, index) => {
		const adminNumber = index + 1;
		return {
			email: `admin-${adminNumber}@gmail.com`,
			phone: `010110000${adminNumber + 1}`,
			password: "admin123!@#",
			profile: {
				name: `관리자${adminNumber}`,
				nickname: `관리자${adminNumber}`,
			},
			role: "ADMIN" as const,
		};
	}),
	// USER 6명
	...Array.from({ length: 6 }, (_, index) => {
		const userNumber = index + 1;
		return {
			email: `user-${userNumber}@gmail.com`,
			phone: `010110000${userNumber + 4}`,
			password: "user123!@#",
			profile: {
				name: `일반유저${userNumber}`,
				nickname: `유저${userNumber}`,
			},
			role: "USER" as const,
		};
	}),
];

// 다양한 그라운드 데이터 (50개)
export const groundSeedData: GroundSeedData[] = Array.from(
	{ length: 10 },
	(_, index) => {
		const companyNumber = index + 1;
		return {
			name: `회사-${companyNumber}`,
			label:
				companyNumber <= 10 ? "본점" : companyNumber <= 30 ? "지점" : "분점",
			address: `서울시 ${getRandomDistrict()}`,
			// 02088xx 패턴으로 변경하여 다른 번호들과 겹치지 않게 함
			phone: `0208800${String(companyNumber).padStart(3, "0")}`,
			email: `company-${companyNumber}@gmail.com`,
			businessNo: `${String(companyNumber).padStart(3, "0")}${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`,
		};
	},
);

// 서울시 구 목록 (랜덤 선택용)
function getRandomDistrict(): string {
	const districts = [
		"강남구",
		"강동구",
		"강북구",
		"강서구",
		"관악구",
		"광진구",
		"구로구",
		"금천구",
		"노원구",
		"도봉구",
		"동대문구",
		"동작구",
		"마포구",
		"서대문구",
		"서초구",
		"성동구",
		"성북구",
		"송파구",
		"양천구",
		"영등포구",
		"용산구",
		"은평구",
		"종로구",
		"중구",
		"중랑구",
	];
	return districts[Math.floor(Math.random() * districts.length)];
}

// Role 타입 카테고리 시드 데이터 (RoleCategoryNames enum 활용)
export interface CategorySeedData {
	roleCategoryEnum: RoleCategoryNames;
	type: "Role" | "Space" | "File" | "User";
	parentId?: string;
}

export const roleCategorySeedData: CategorySeedData[] = [
	{
		roleCategoryEnum: RoleCategoryNames.COMMON,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryNames.USER,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryNames.ADMIN,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryNames.MANAGER,
		type: "Role",
	},
];

// Role 시드 데이터 (role.prisma의 Role 모델에 대응)
export interface RoleSeedData {
	name: "USER" | "ADMIN" | "SUPER_ADMIN";
}

export const roleSeedData: RoleSeedData[] = [
	{
		name: "SUPER_ADMIN",
	},
	{
		name: "ADMIN",
	},
	{
		name: "USER",
	},
];

// RoleClassification 시드 데이터 (Role과 Category type="Role" 연결)
// role.prisma의 RoleClassification 모델: categoryId, roleId로 연결

export interface RoleClassificationSeedData {
	roleName: "USER" | "ADMIN" | "SUPER_ADMIN";
	roleCategoryEnum: RoleCategoryNames; // RoleCategoryNames enum 사용
}

export const roleClassificationSeedData: RoleClassificationSeedData[] = [
	{
		roleName: "SUPER_ADMIN",
		roleCategoryEnum: RoleCategoryNames.COMMON, // "공통" 카테고리
	},
	{
		roleName: "ADMIN",
		roleCategoryEnum: RoleCategoryNames.ADMIN, // "운영자" 카테고리
	},
	{
		roleName: "USER",
		roleCategoryEnum: RoleCategoryNames.USER, // "유저" 카테고리
	},
];

// Role Group 시드 데이터 (RoleGroupNames enum 활용)

export interface RoleGroupSeedData {
	roleGroupEnum: RoleGroupNames;
}

export const roleGroupSeedData: RoleGroupSeedData[] = [
	{
		roleGroupEnum: RoleGroupNames.NORMAL,
	},
	{
		roleGroupEnum: RoleGroupNames.VIP,
	},
];

// Role과 Group 연결 (RoleAssociation) 시드 데이터
export interface RoleAssociationSeedData {
	roleName: "USER" | "ADMIN" | "SUPER_ADMIN";
	roleGroupEnum: RoleGroupNames;
}

export const roleAssociationSeedData: RoleAssociationSeedData[] = [
	// SUPER_ADMIN은 VIP 그룹
	{
		roleName: "SUPER_ADMIN",
		roleGroupEnum: RoleGroupNames.VIP,
	},
	// ADMIN은 VIP 그룹
	{
		roleName: "ADMIN",
		roleGroupEnum: RoleGroupNames.VIP,
	},
	// USER는 NORMAL 그룹
	{
		roleName: "USER",
		roleGroupEnum: RoleGroupNames.NORMAL,
	},
];

// 유저와 그라운드 매핑 (각 유저는 1-3개의 그라운드에 소속)
export const userGroundMapping: {
	userIndex: number;
	groundIndices: number[];
}[] = Array.from({ length: 10 }, (_, userIndex) => {
	const numGrounds = Math.floor(Math.random() * 3) + 1; // 1-3개 그라운드
	const groundIndices: number[] = [];

	while (groundIndices.length < numGrounds) {
		const randomGroundIndex = Math.floor(Math.random() * 10);
		if (!groundIndices.includes(randomGroundIndex)) {
			groundIndices.push(randomGroundIndex);
		}
	}

	return {
		userIndex,
		groundIndices,
	};
});
