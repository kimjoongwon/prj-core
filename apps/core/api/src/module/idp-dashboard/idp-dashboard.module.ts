import { IdpDashboardAggregateRoot } from "@cocrepo/aggregate";
import { IdpDashboardUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { IdpDashboardController } from "./idp-dashboard.controller";

@Module({
	imports: [CqrsModule],
	controllers: [IdpDashboardController],
	providers: [...IdpDashboardUseCaseProviders, IdpDashboardAggregateRoot],
})
export class IdpDashboardModule {}
