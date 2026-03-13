import { IdpDashboardFacade } from "@cocrepo/facade";
import { Module } from "@nestjs/common";
import { IdpDashboardController } from "./idp-dashboard.controller";

@Module({
	controllers: [IdpDashboardController],
	providers: [IdpDashboardFacade],
})
export class IdpDashboardModule {}
