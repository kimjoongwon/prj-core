import { OidcSessionAggregateRoot } from "@cocrepo/aggregate";
import { RevokeAllOidcSessionsCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(RevokeAllOidcSessionsCommand)
export class RevokeAllOidcSessionsUseCase
	implements ICommandHandler<RevokeAllOidcSessionsCommand>
{
	constructor(private readonly oidcSessionService: OidcSessionAggregateRoot) {}

	execute(): Promise<number> {
		return this.oidcSessionService.revokeAll();
	}
}
