export interface OidcAuthUserData {
	id: bigint;
	userId: string;
	email: string;
	password: string;
	failedLoginAttempts: number;
	lockedUntil: Date | null;
	isPermanentlyLocked: boolean;
	isActive: boolean;
	mustChangePassword: boolean;
}
