export interface VerifyTokenResult {
	valid: boolean;
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
	hasFullAccess: boolean;
}
