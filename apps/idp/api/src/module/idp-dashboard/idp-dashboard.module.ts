import { IdpDashboardAggregateRoot } from "@cocrepo/aggregate";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { IdpDashboardController } from "./idp-dashboard.controller";
import { IdpDashboardUseCaseProviders } from "@cocrepo/usecase";

@Module({
	imports: [CqrsModule],
	controllers: [IdpDashboardController],
	providers: [...IdpDashboardUseCaseProviders, IdpDashboardAggregateRoot],
})
export class IdpDashboardModule {}
