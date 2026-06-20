import { IdpAccountAggregate } from "@cocrepo/aggregate";
import { AuthAuditLogsRepository } from "@cocrepo/repository";
import { SpaceContext } from "@cocrepo/service";
import { IdpAccountUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { IdpAccountsController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [IdpAccountsController],
	providers: [
		...IdpAccountUseCaseProviders,
		IdpAccountAggregate,
		SpaceContext,
		AuthAuditLogsRepository,
	],
})
export class IdpAccountsModule {}
