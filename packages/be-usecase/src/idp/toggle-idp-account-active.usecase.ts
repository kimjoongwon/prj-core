import { IdpAccountAggregateRoot } from "@cocrepo/aggregate";
import { ToggleIdpAccountActiveCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(ToggleIdpAccountActiveCommand)
export class ToggleIdpAccountActiveUseCase
	implements ICommandHandler<ToggleIdpAccountActiveCommand>
{
	constructor(private readonly idpAccountService: IdpAccountAggregateRoot) {}

	execute(command: ToggleIdpAccountActiveCommand): Promise<unknown> {
		return this.idpAccountService.toggleActive(command.userId);
	}
}
