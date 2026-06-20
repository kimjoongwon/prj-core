import { RequestPasswordResetCommand } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import {
	IDP_PASSWORD_RESET_SERVICE,
	type PasswordResetPort,
} from "@cocrepo/service";

@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetUseCase {
	constructor(
		@Inject(IDP_PASSWORD_RESET_SERVICE)
		private readonly passwordResetService: PasswordResetPort,
	) {}

	execute(command: RequestPasswordResetCommand) {
		return this.passwordResetService.requestReset(command.email);
	}
}
