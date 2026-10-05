import { IdpDashboardAggregate } from "@cocrepo/aggregate";
import { GetIdpLoginTrendQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetIdpLoginTrendQuery)
export class GetIdpLoginTrendUseCase {
	constructor(private readonly idpDashboardService: IdpDashboardAggregate) {}

	execute(): Promise<unknown> {
		return this.idpDashboardService.getLoginTrend();
	}
}
