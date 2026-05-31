import { IdpDashboardAggregateRoot } from "@cocrepo/aggregate";
import { Injectable } from "@nestjs/common";

@Injectable()
export class IdpDashboardFacade {
	constructor(
		private readonly idpDashboardService: IdpDashboardAggregateRoot,
	) {}

	getStats() {
		return this.idpDashboardService.getStats();
	}

	getLoginTrend() {
		return this.idpDashboardService.getLoginTrend();
	}
}
