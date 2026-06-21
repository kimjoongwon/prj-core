import { OidcSessionAggregate } from "@cocrepo/aggregate";
import { RevokeAllOidcSessionsCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(RevokeAllOidcSessionsCommand)
export class RevokeAllOidcSessionsUseCase {
	constructor(private readonly oidcSessionService: OidcSessionAggregate) {}

	execute(): Promise<number> {
		return this.oidcSessionService.revokeAll();
	}
}
