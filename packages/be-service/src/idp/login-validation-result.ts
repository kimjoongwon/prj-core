export interface LoginValidationResult {
	success: boolean;
	/** OIDC accountId/subject로 전달할 User 모델 ULID입니다. */
	userId?: string;
	error?: string;
	remainingAttempts?: number;
	lockedUntil?: Date;
	temporaryLockThreshold?: number;
	temporaryLockDurationMin?: number;
}
