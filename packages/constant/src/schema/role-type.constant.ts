export enum RoleType {
	VIEW = "VIEW",
	MANAGE = "MANAGE",
}

/**
 * 시스템 역할 상수
 * Prisma Roles enum 대체 (동적 역할 생성 지원)
 */
export const SYSTEM_ROLES = {
	FULL_ACCESS: "FULL_ACCESS",
	MANAGE: "MANAGE",
	VIEW: "VIEW",
} as const;

export type SystemRoleName = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];
