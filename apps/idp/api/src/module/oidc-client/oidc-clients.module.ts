import { OidcClientsRepository } from "@cocrepo/repository";
import { OidcClientFacade } from "@cocrepo/facade";
import { Module } from "@nestjs/common";
import { OidcClientsController } from "./oidc-clients.controller";

@Module({
	controllers: [OidcClientsController],
	providers: [OidcClientFacade, OidcClientsRepository],
	exports: [OidcClientFacade],
})
export class OidcClientsModule {}
