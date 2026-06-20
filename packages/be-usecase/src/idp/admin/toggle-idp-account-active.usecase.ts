import { IdpAccountAggregate } from "@cocrepo/aggregate";
import { ToggleIdpAccountActiveCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(ToggleIdpAccountActiveCommand)
export class ToggleIdpAccountActiveUseCase {
	constructor(private readonly idpAccountService: IdpAccountAggregate) {}

	execute(command: ToggleIdpAccountActiveCommand): Promise<unknown> {
		return this.idpAccountService.toggleActive(command.userId);
	}
}
