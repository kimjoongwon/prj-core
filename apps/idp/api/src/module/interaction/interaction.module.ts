import { Module } from "@nestjs/common";
import { OidcModule } from "../oidc/oidc.module";
import { InteractionController } from "./interaction.controller";
import { InteractionFacade } from "./interaction.facade";
import { InteractionService } from "./interaction.service";
import { InteractionLoginService } from "./interaction-login.service";

@Module({
	imports: [OidcModule],
	controllers: [InteractionController],
	providers: [InteractionFacade, InteractionLoginService, InteractionService],
})
export class InteractionModule {}
