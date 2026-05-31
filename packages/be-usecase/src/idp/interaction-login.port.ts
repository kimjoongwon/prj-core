import type { LoginValidationResult } from "./login-validation.result";

export interface InteractionLoginPort {
	validateUser(
		email: string,
		password: string,
		ipAddress: string,
		userAgent?: string,
		clientId?: string,
	): Promise<LoginValidationResult>;
}
