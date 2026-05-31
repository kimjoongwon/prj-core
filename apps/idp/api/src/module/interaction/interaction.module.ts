import {
	IDP_INTERACTION_LOGIN_SERVICE,
	IDP_INTERACTION_SERVICE,
	InteractionUseCaseProviders,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcModule } from "../oidc/oidc.module";
import { InteractionController } from "./interaction.controller";
import { InteractionService } from "./interaction.service";
import { InteractionLoginService } from "./interaction-login.service";

@Module({
	imports: [CqrsModule, OidcModule],
	controllers: [InteractionController],
	providers: [
		...InteractionUseCaseProviders,
		InteractionLoginService,
		InteractionService,
		{
			provide: IDP_INTERACTION_LOGIN_SERVICE,
			useExisting: InteractionLoginService,
		},
		{
			provide: IDP_INTERACTION_SERVICE,
			useExisting: InteractionService,
		},
	],
	exports: [InteractionLoginService],
})
export class InteractionModule {}
