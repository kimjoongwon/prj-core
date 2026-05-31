import { ExecutePasswordResetCommand } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
	IDP_PASSWORD_RESET_SERVICE,
	type PasswordResetPort,
} from "./idp.ports";

@CommandHandler(ExecutePasswordResetCommand)
export class ExecutePasswordResetUseCase
	implements ICommandHandler<ExecutePasswordResetCommand>
{
	constructor(
		@Inject(IDP_PASSWORD_RESET_SERVICE)
		private readonly passwordResetService: PasswordResetPort,
	) {}

	execute(command: ExecutePasswordResetCommand) {
		return this.passwordResetService.executeReset(
			command.token,
			command.password,
		);
	}
}
