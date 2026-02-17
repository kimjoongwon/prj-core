import { OidcSessionsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { OidcSessionsController } from "./oidc-sessions.controller";

@Module({
	controllers: [OidcSessionsController],
	providers: [OidcSessionsService],
	exports: [OidcSessionsService],
})
export class OidcSessionsModule {}
