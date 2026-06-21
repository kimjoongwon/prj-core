import { OidcSessionAggregate } from "@cocrepo/aggregate";
import { RevokeOidcSessionsByGrantCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(RevokeOidcSessionsByGrantCommand)
export class RevokeOidcSessionsByGrantIdUseCase {
	constructor(private readonly oidcSessionService: OidcSessionAggregate) {}

	execute(command: RevokeOidcSessionsByGrantCommand): Promise<number> {
		return this.oidcSessionService.revokeByGrantId(command.grantId);
	}
}
