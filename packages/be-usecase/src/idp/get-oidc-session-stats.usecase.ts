import { OidcSessionAggregateRoot } from "@cocrepo/aggregate";
import { GetOidcSessionStatsQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetOidcSessionStatsQuery)
export class GetOidcSessionStatsUseCase
	implements IQueryHandler<GetOidcSessionStatsQuery>
{
	constructor(private readonly oidcSessionService: OidcSessionAggregateRoot) {}

	execute(): Promise<unknown> {
		return this.oidcSessionService.getStats();
	}
}
