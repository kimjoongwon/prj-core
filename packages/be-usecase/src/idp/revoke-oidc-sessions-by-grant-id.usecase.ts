import { OidcSessionAggregate } from "@cocrepo/aggregate";
import { RevokeOidcSessionsByGrantCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(RevokeOidcSessionsByGrantCommand)
export class RevokeOidcSessionsByGrantIdUseCase
	implements ICommandHandler<RevokeOidcSessionsByGrantCommand>
{
	constructor(private readonly oidcSessionService: OidcSessionAggregate) {}

	execute(command: RevokeOidcSessionsByGrantCommand): Promise<number> {
		return this.oidcSessionService.revokeByGrantId(command.grantId);
	}
}
