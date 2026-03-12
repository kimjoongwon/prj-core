import { Injectable } from "@nestjs/common";
import {
	PasswordResetService,
	type TokenValidationResult,
} from "./password-reset.service";

@Injectable()
export class PasswordResetApplicationService {
	constructor(private readonly passwordResetService: PasswordResetService) {}

	getPasswordPolicy() {
		return this.passwordResetService.getPasswordPolicy();
	}

	requestReset(email: string): Promise<void> {
		return this.passwordResetService.requestReset(email);
	}

	validateToken(rawToken: string): Promise<TokenValidationResult> {
		return this.passwordResetService.validateToken(rawToken);
	}

	executeReset(rawToken: string, newPassword: string): Promise<void> {
		return this.passwordResetService.executeReset(rawToken, newPassword);
	}
}
