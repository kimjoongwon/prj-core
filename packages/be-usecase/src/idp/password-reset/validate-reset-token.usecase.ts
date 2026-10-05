import { ValidateResetTokenQuery } from "@cocrepo/command";
import { PasswordResetService } from "@cocrepo/service";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(ValidateResetTokenQuery)
export class ValidateResetTokenUseCase {
	constructor(private readonly passwordResetService: PasswordResetService) {}

	execute(query: ValidateResetTokenQuery) {
		return this.passwordResetService.validateToken(query.token);
	}
}
