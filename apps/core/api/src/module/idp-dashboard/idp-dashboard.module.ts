import { IdpDashboardAggregate } from "@cocrepo/aggregate";
import { IdpDashboardController } from "@cocrepo/controller";
import { IdpDashboardUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [IdpDashboardController],
	providers: [...IdpDashboardUseCaseProviders, IdpDashboardAggregate],
})
export class IdpDashboardModule {}
