import { ValidateResetTokenQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";
import { PasswordResetService } from "@cocrepo/service";

@QueryHandler(ValidateResetTokenQuery)
export class ValidateResetTokenUseCase {
	constructor(
		private readonly passwordResetService: PasswordResetService,
	) {}

	execute(query: ValidateResetTokenQuery) {
		return this.passwordResetService.validateToken(query.token);
	}
}
