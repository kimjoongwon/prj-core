import { RequestPasswordResetCommand } from "@cocrepo/command";
import { PasswordResetService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetUseCase {
	constructor(private readonly passwordResetService: PasswordResetService) {}

	execute(command: RequestPasswordResetCommand) {
		return this.passwordResetService.requestReset(command.email);
	}
}
