import { IdpAccountAggregate } from "@cocrepo/aggregate";
import { ResetIdpAccountFailedAttemptsCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(ResetIdpAccountFailedAttemptsCommand)
export class ResetIdpAccountFailedAttemptsUseCase {
	constructor(private readonly idpAccountService: IdpAccountAggregate) {}

	async execute(command: ResetIdpAccountFailedAttemptsCommand): Promise<void> {
		await this.idpAccountService.resetFailedAttempts(command.userId);
	}
}
