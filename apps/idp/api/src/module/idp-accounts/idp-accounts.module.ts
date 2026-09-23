import { IdpAccountAggregate } from "@cocrepo/aggregate";
import { SpaceContext } from "@cocrepo/context";
import { IdpAccountsController } from "@cocrepo/controller";
import {
	AuthAuditLogsRepository,
	RolesRepository,
	SpacesRepository,
	TenantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
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
		UsersRepository,
		SpacesRepository,
		RolesRepository,
		TenantsRepository,
	],
})
export class IdpAccountsModule {}
