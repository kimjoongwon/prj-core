import { OidcClientAggregate } from "@cocrepo/aggregate";
import { OidcClientsRepository } from "@cocrepo/repository";
import { OidcClientUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcModule } from "../oidc/oidc.module";

@Module({
	imports: [CqrsModule, OidcModule],
	providers: [
		...OidcClientUseCaseProviders,
		OidcClientAggregate,
		OidcClientsRepository,
	],
	exports: [OidcClientAggregate],
})
export class OidcClientsModule {}
