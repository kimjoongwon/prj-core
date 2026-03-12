import { IdpDashboardApplicationService } from "@cocrepo/app";
import { Module } from "@nestjs/common";
import { IdpDashboardController } from "./idp-dashboard.controller";

@Module({
	controllers: [IdpDashboardController],
	providers: [IdpDashboardApplicationService],
})
export class IdpDashboardModule {}
