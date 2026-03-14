import { OidcClientFacade } from "@cocrepo/facade";
import { OidcClientsRepository } from "@cocrepo/repository";
import { OidcClientService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { OidcClientsController } from "./oidc-clients.controller";

@Module({
	controllers: [OidcClientsController],
	providers: [OidcClientFacade, OidcClientService, OidcClientsRepository],
	exports: [OidcClientFacade],
})
export class OidcClientsModule {}
