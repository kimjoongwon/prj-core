import { OidcSessionsApplicationService } from "@cocrepo/app";
import { Module } from "@nestjs/common";
import { OidcSessionsController } from "./oidc-sessions.controller";

@Module({
	controllers: [OidcSessionsController],
	providers: [OidcSessionsApplicationService],
	exports: [OidcSessionsApplicationService],
})
export class OidcSessionsModule {}
