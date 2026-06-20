export interface PasswordResetPort {
	getPasswordPolicy(): Promise<unknown>;
	requestReset(email: string): Promise<unknown>;
	validateToken(token: string): Promise<unknown>;
	executeReset(token: string, password: string): Promise<unknown>;
}
