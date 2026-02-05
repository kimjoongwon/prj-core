import { Module } from "@nestjs/common";
import { OidcModule } from "../oidc/oidc.module";
import { InteractionController } from "./interaction.controller";
import { InteractionService } from "./interaction.service";

@Module({
	imports: [OidcModule],
	controllers: [InteractionController],
	providers: [InteractionService],
})
export class InteractionModule {}
