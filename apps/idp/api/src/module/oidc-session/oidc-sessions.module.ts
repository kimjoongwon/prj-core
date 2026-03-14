import { OidcSessionFacade } from "@cocrepo/facade";
import { OidcSessionService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { OidcSessionsController } from "./oidc-sessions.controller";

@Module({
	controllers: [OidcSessionsController],
	providers: [OidcSessionFacade, OidcSessionService],
	exports: [OidcSessionFacade],
})
export class OidcSessionsModule {}
