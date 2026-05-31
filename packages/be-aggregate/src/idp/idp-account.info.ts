export interface IdpAccountInfo {
	id: string;
	name: string;
	email: string;
	isActive: boolean;
	failedLoginAttempts: number;
	isPermanentlyLocked: boolean;
	lockedUntil: Date | null;
	mustChangePassword: boolean;
	lastLoginAt: Date | null;
	lastLoginIp: string | null;
	createdAt: Date;
}
