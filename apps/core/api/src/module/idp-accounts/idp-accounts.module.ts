import { SpaceContext } from "@cocrepo/context";
import { IdpAccountAggregate } from "@cocrepo/aggregate";
import { IdpAccountsController } from "@cocrepo/controller";
import { AuthAuditLogsRepository } from "@cocrepo/repository";
import { IdpAccountUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

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
