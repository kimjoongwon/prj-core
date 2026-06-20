import { IdpDashboardAggregate } from "@cocrepo/aggregate";
import { IdpDashboardUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { IdpDashboardController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [IdpDashboardController],
	providers: [...IdpDashboardUseCaseProviders, IdpDashboardAggregate],
})
export class IdpDashboardModule {}
