export enum RoleType {
	MEMBER = "MEMBER",
	COMPANY_MANAGER = "COMPANY_MANAGER",
}

/**
 * 시스템 역할 상수
 * Prisma Roles enum 대체 (동적 역할 생성 지원)
 */
export const SYSTEM_ROLES = {
	PLATFORM_ADMIN: "PLATFORM_ADMIN",
	COMPANY_MANAGER: "COMPANY_MANAGER",
	MEMBER: "MEMBER",
} as const;

export type SystemRoleName = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];
