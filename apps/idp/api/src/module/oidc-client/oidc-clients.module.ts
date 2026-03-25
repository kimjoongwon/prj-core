import { OidcClientFacade } from "@cocrepo/facade";
import { OidcClientsRepository } from "@cocrepo/repository";
import { OidcClientService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { OidcModule } from "../oidc/oidc.module";
import { OidcClientsController } from "./oidc-clients.controller";

@Module({
	imports: [OidcModule],
	controllers: [OidcClientsController],
	providers: [OidcClientFacade, OidcClientService, OidcClientsRepository],
	exports: [OidcClientFacade, OidcClientService],
})
export class OidcClientsModule {}
