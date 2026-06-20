import { InteractionController } from "@cocrepo/controller";
import {
	InteractionLoginService as ServiceInteractionLoginService,
	InteractionService,
} from "@cocrepo/service";
import {
	IDP_INTERACTION_LOGIN_SERVICE,
	InteractionUseCaseProviders,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcModule } from "../oidc/oidc.module";

@Module({
	imports: [CqrsModule, OidcModule],
	controllers: [InteractionController],
	providers: [
		...InteractionUseCaseProviders,
		ServiceInteractionLoginService,
		InteractionService,
		{
			provide: IDP_INTERACTION_LOGIN_SERVICE,
			useExisting: ServiceInteractionLoginService,
		},
	],
	exports: [ServiceInteractionLoginService],
})
export class InteractionModule {}
