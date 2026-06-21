import { OidcSessionAggregate } from "@cocrepo/aggregate";
import { GetOidcSessionStatsQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetOidcSessionStatsQuery)
export class GetOidcSessionStatsUseCase {
	constructor(private readonly oidcSessionService: OidcSessionAggregate) {}

	execute(): Promise<unknown> {
		return this.oidcSessionService.getStats();
	}
}
