export const ACCOUNT_SELECT = {
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
} as const;
