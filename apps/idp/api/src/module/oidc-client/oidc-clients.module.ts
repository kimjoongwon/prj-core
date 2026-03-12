import { OidcClientsRepository } from "@cocrepo/repository";
import { OidcClientsApplicationService } from "@cocrepo/app";
import { Module } from "@nestjs/common";
import { OidcClientsController } from "./oidc-clients.controller";

@Module({
	controllers: [OidcClientsController],
	providers: [OidcClientsApplicationService, OidcClientsRepository],
	exports: [OidcClientsApplicationService],
})
export class OidcClientsModule {}
