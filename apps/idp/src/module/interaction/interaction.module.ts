import { Module } from "@nestjs/common";
import { InteractionController } from "./interaction.controller";
import { InteractionService } from "./interaction.service";
import { UsersRepository } from "@cocrepo/repository";
import { UsersService } from "@cocrepo/service";
import { OidcModule } from "../oidc/oidc.module";

@Module({
	imports: [OidcModule],
	controllers: [InteractionController],
	providers: [InteractionService, UsersRepository, UsersService],
})
export class InteractionModule {}
