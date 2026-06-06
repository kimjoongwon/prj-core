export interface TokenValidationResult {
	valid: boolean;
	email?: string;
	reason?: string;
}
