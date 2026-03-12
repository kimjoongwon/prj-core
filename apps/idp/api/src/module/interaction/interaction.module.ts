import { Module } from "@nestjs/common";
import { OidcModule } from "../oidc/oidc.module";
import { InteractionController } from "./interaction.controller";
import { InteractionApplicationService } from "./interaction.application-service";
import { InteractionService } from "./interaction.service";

@Module({
	imports: [OidcModule],
	controllers: [InteractionController],
	providers: [InteractionApplicationService, InteractionService],
})
export class InteractionModule {}
