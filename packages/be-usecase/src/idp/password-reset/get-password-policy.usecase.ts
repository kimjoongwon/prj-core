import { GetPasswordPolicyQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";
import { PasswordResetService } from "@cocrepo/service";

@QueryHandler(GetPasswordPolicyQuery)
export class GetPasswordPolicyUseCase {
	constructor(
		private readonly passwordResetService: PasswordResetService,
	) {}

	execute() {
		return this.passwordResetService.getPasswordPolicy();
	}
}
