import { ExecutePasswordResetCommand } from "@cocrepo/command";
import { PasswordResetService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(ExecutePasswordResetCommand)
export class ExecutePasswordResetUseCase {
	constructor(private readonly passwordResetService: PasswordResetService) {}

	execute(command: ExecutePasswordResetCommand) {
		return this.passwordResetService.executeReset(
			command.token,
			command.password,
		);
	}
}
