import { OidcClientAggregateRoot } from "@cocrepo/aggregate";
import { OidcClientsRepository } from "@cocrepo/repository";
import { OidcProviderService } from "@cocrepo/service";
import {
	IDP_OIDC_PROVIDER_SERVICE,
	OidcClientUseCaseProviders,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcModule } from "../oidc/oidc.module";
import { OidcClientsController } from "./oidc-clients.controller";

@Module({
	imports: [CqrsModule, OidcModule],
	controllers: [OidcClientsController],
	providers: [
		...OidcClientUseCaseProviders,
		OidcClientAggregateRoot,
		OidcClientsRepository,
		{
			provide: IDP_OIDC_PROVIDER_SERVICE,
			useExisting: OidcProviderService,
		},
	],
	exports: [OidcClientAggregateRoot],
})
export class OidcClientsModule {}
