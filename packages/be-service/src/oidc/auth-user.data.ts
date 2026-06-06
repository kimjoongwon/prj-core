export interface AuthUserData {
	id: string;
	email: string;
	password: string;
	failedLoginAttempts: number;
	lockedUntil: Date | null;
	isPermanentlyLocked: boolean;
	isActive: boolean;
	mustChangePassword: boolean;
}
