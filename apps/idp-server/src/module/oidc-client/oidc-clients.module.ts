import { OidcClientsRepository } from "@cocrepo/repository";
import { OidcClientsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { OidcClientsController } from "./oidc-clients.controller";

@Module({
	controllers: [OidcClientsController],
	providers: [OidcClientsService, OidcClientsRepository],
	exports: [OidcClientsService],
})
export class OidcClientsModule {}
