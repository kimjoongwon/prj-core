import { RequestPasswordResetCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";
import { PasswordResetService } from "@cocrepo/service";

@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetUseCase {
	constructor(
		private readonly passwordResetService: PasswordResetService,
	) {}

	execute(command: RequestPasswordResetCommand) {
		return this.passwordResetService.requestReset(command.email);
	}
}
