import { OidcSessionFacade } from "@cocrepo/facade";
import { Module } from "@nestjs/common";
import { OidcSessionsController } from "./oidc-sessions.controller";

@Module({
	controllers: [OidcSessionsController],
	providers: [OidcSessionFacade],
	exports: [OidcSessionFacade],
})
export class OidcSessionsModule {}
