import { GetPasswordPolicyQuery } from "@cocrepo/command";
import { PasswordResetService } from "@cocrepo/service";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetPasswordPolicyQuery)
export class GetPasswordPolicyUseCase {
	constructor(private readonly passwordResetService: PasswordResetService) {}

	execute() {
		return this.passwordResetService.getPasswordPolicy();
	}
}
