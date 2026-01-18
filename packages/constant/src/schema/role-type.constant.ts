export enum RoleType {
	USER = "USER",
	ADMIN = "ADMIN",
}

/**
 * 시스템 역할 상수
 * Prisma Roles enum 대체 (동적 역할 생성 지원)
 */
export const SYSTEM_ROLES = {
	SUPER_ADMIN: "SUPER_ADMIN",
	ADMIN: "ADMIN",
	USER: "USER",
} as const;

export type SystemRoleName = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];
