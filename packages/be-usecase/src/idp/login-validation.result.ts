export interface LoginValidationResult {
	success: boolean;
	userId?: string;
	mustChangePassword?: boolean;
	error?: string;
	remainingAttempts?: number;
	lockedUntil?: Date;
	temporaryLockThreshold?: number;
	temporaryLockDurationMin?: number;
}
