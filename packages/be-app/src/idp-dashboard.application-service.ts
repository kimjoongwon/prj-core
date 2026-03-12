import { IdpDashboardService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class IdpDashboardApplicationService {
	constructor(private readonly idpDashboardService: IdpDashboardService) {}

	getStats() {
		return this.idpDashboardService.getStats();
	}

	getLoginTrend() {
		return this.idpDashboardService.getLoginTrend();
	}
}
