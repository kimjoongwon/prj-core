import { EmailVerificationAggregate } from "@cocrepo/aggregate";
import { ResendEmailVerificationCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(ResendEmailVerificationCommand)
export class ResendEmailVerificationUseCase
	implements ICommandHandler<ResendEmailVerificationCommand>
{
	constructor(
		private readonly emailVerificationService: EmailVerificationAggregate,
	) {}

	execute(command: ResendEmailVerificationCommand): Promise<unknown> {
		return this.emailVerificationService.resend(command.emailVerificationId);
	}
}
