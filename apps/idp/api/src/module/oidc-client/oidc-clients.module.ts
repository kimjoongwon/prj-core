import { OidcClientAggregate } from "@cocrepo/aggregate";
import { OidcClientsController } from "@cocrepo/controller";
import { OidcClientsRepository } from "@cocrepo/repository";
import { OidcClientUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcModule } from "../oidc/oidc.module";

@Module({
	imports: [CqrsModule, OidcModule],
	controllers: [OidcClientsController],
	providers: [
		...OidcClientUseCaseProviders,
		OidcClientAggregate,
		OidcClientsRepository,
	],
	exports: [OidcClientAggregate],
})
export class OidcClientsModule {}
