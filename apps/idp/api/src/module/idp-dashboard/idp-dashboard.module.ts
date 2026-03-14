import { IdpDashboardFacade } from "@cocrepo/facade";
import { IdpDashboardService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { IdpDashboardController } from "./idp-dashboard.controller";

@Module({
	controllers: [IdpDashboardController],
	providers: [IdpDashboardFacade, IdpDashboardService],
})
export class IdpDashboardModule {}
