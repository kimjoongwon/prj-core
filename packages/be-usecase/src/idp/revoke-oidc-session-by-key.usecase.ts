import { OidcSessionAggregateRoot } from "@cocrepo/aggregate";
import { RevokeOidcSessionCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(RevokeOidcSessionCommand)
export class RevokeOidcSessionByKeyUseCase
	implements ICommandHandler<RevokeOidcSessionCommand>
{
	constructor(private readonly oidcSessionService: OidcSessionAggregateRoot) {}

	execute(command: RevokeOidcSessionCommand): Promise<void> {
		return this.oidcSessionService.revokeByKey(command.key);
	}
}
