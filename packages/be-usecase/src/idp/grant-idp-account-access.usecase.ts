import { IdpAccountAggregateRoot } from "@cocrepo/aggregate";
import { GrantIdpAccountAccessCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(GrantIdpAccountAccessCommand)
export class GrantIdpAccountAccessUseCase
	implements ICommandHandler<GrantIdpAccountAccessCommand>
{
	constructor(private readonly idpAccountService: IdpAccountAggregateRoot) {}

	execute(command: GrantIdpAccountAccessCommand): Promise<unknown> {
		return this.idpAccountService.grantAccess(command.userId, command.dto);
	}
}
