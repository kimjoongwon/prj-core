import { AuthAuditLogsRepository } from "@cocrepo/repository";
import { IdpAccountAggregateRoot } from "@cocrepo/aggregate";
import { SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { IdpAccountsController } from "./idp-accounts.controller";
import { IdpAccountUseCaseProviders } from "@cocrepo/usecase";

@Module({
	imports: [CqrsModule],
	controllers: [IdpAccountsController],
	providers: [
		...IdpAccountUseCaseProviders,
		IdpAccountAggregateRoot,
		SpaceContext,
		AuthAuditLogsRepository,
	],
})
export class IdpAccountsModule {}
