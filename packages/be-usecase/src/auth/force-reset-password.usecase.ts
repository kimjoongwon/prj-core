import { ForceResetPasswordCommand } from "@cocrepo/command";
import {
	EmailService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(ForceResetPasswordCommand)
export class ForceResetPasswordUseCase
	implements ICommandHandler<ForceResetPasswordCommand>
{
	constructor(
		private readonly usersService: UserService,
		private readonly emailService: EmailService,
		private readonly tokenStorageService: TokenStorageService,
	) {}

	async execute(command: ForceResetPasswordCommand): Promise<boolean> {
		const result = await this.usersService.forceResetPassword(command.userId);
		await this.emailService.sendTemporaryPasswordEmail(
			result.email,
			result.temporaryPassword,
		);
		await this.tokenStorageService.deleteRefreshToken(command.userId);
		return true;
	}
}
