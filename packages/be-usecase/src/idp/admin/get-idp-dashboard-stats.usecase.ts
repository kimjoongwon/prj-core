import { IdpDashboardAggregate } from "@cocrepo/aggregate";
import { GetIdpDashboardStatsQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetIdpDashboardStatsQuery)
export class GetIdpDashboardStatsUseCase {
	constructor(private readonly idpDashboardService: IdpDashboardAggregate) {}

	execute(): Promise<unknown> {
		return this.idpDashboardService.getStats();
	}
}
