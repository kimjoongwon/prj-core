export interface OidcAuthUserData {
	id: string;
	seq: bigint;
	email: string;
	password: string;
	failedLoginAttempts: number;
	lockedUntil: Date | null;
	isPermanentlyLocked: boolean;
	isActive: boolean;
}
