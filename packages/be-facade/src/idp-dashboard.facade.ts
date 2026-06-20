import { IdpDashboardAggregate } from "@cocrepo/aggregate";
import { Injectable } from "@nestjs/common";

@Injectable()
export class IdpDashboardFacade {
	constructor(
		private readonly idpDashboardService: IdpDashboardAggregate,
	) {}

	getStats() {
		return this.idpDashboardService.getStats();
	}

	getLoginTrend() {
		return this.idpDashboardService.getLoginTrend();
	}
}
