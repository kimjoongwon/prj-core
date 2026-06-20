import { IdpDashboardAggregate } from "@cocrepo/aggregate";
import { GetIdpLoginTrendQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetIdpLoginTrendQuery)
export class GetIdpLoginTrendUseCase
	implements IQueryHandler<GetIdpLoginTrendQuery>
{
	constructor(
		private readonly idpDashboardService: IdpDashboardAggregate,
	) {}

	execute(): Promise<unknown> {
		return this.idpDashboardService.getLoginTrend();
	}
}
