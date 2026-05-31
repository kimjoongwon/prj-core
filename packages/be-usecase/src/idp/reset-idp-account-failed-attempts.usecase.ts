import { IdpAccountAggregateRoot } from "@cocrepo/aggregate";
import { ResetIdpAccountFailedAttemptsCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(ResetIdpAccountFailedAttemptsCommand)
export class ResetIdpAccountFailedAttemptsUseCase
	implements ICommandHandler<ResetIdpAccountFailedAttemptsCommand>
{
	constructor(private readonly idpAccountService: IdpAccountAggregateRoot) {}

	async execute(command: ResetIdpAccountFailedAttemptsCommand): Promise<void> {
		await this.idpAccountService.resetFailedAttempts(command.userId);
	}
}
