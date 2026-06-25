import type { Prisma } from "@cocrepo/prisma";

export const IDP_ACCOUNT_SELECT = {
	id: true,
	name: true,
	email: true,
	isActive: true,
	failedLoginAttempts: true,
	isPermanentlyLocked: true,
	lockedUntil: true,
	mustChangePassword: true,
	lastLoginAt: true,
	lastLoginIp: true,
	createdAt: true,
} as const satisfies Prisma.UserSelect;

export type IdpAccountRecord = Prisma.UserGetPayload<{
	select: typeof IDP_ACCOUNT_SELECT;
}>;
