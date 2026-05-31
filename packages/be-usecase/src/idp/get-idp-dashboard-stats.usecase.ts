import { IdpDashboardAggregateRoot } from "@cocrepo/aggregate";
import { GetIdpDashboardStatsQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetIdpDashboardStatsQuery)
export class GetIdpDashboardStatsUseCase
	implements IQueryHandler<GetIdpDashboardStatsQuery>
{
	constructor(
		private readonly idpDashboardService: IdpDashboardAggregateRoot,
	) {}

	execute(): Promise<unknown> {
		return this.idpDashboardService.getStats();
	}
}
