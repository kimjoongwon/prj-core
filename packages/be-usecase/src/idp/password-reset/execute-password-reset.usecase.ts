import { ExecutePasswordResetCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";
import { PasswordResetService } from "@cocrepo/service";

@CommandHandler(ExecutePasswordResetCommand)
export class ExecutePasswordResetUseCase {
	constructor(
		private readonly passwordResetService: PasswordResetService,
	) {}

	execute(command: ExecutePasswordResetCommand) {
		return this.passwordResetService.executeReset(
			command.token,
			command.password,
		);
	}
}
