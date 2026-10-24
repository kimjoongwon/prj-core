import type { Prisma } from "@cocrepo/prisma";

/**
 * IDP 계정 projection.
 * 상태 필드는 UserStatus 1:1 관계에서 조회한 뒤 평평하게 펴서 반환합니다.
 */
export const IDP_ACCOUNT_SELECT = {
	id: true,
	name: true,
	email: true,
	createdAt: true,
	status: {
		select: {
			isActive: true,
			failedLoginAttempts: true,
			isPermanentlyLocked: true,
			lockedUntil: true,
			lastLoginAt: true,
			lastLoginIp: true,
		},
	},
} as const satisfies Prisma.UserSelect;

type RawIdpAccountRecord = Prisma.UserGetPayload<{
	select: typeof IDP_ACCOUNT_SELECT;
}>;

/** API/DTO 형상 유지를 위해 status 관계를 펼친 레코드 형태입니다. */
export type IdpAccountRecord = Omit<RawIdpAccountRecord, "status"> &
	NonNullable<RawIdpAccountRecord["status"]>;

export function flattenIdpAccountRecord(
	raw: RawIdpAccountRecord,
): IdpAccountRecord {
	const { status, ...account } = raw;
	// Prisma 타입은 status를 null 가능 관계로 표기하지만 UserStatus는 1:1 필수 분리라
	// 런타임에는 항상 존재한다. null이면 전개가 no-op라 형상이 유지된다.
	return { ...account, ...status! };
}
