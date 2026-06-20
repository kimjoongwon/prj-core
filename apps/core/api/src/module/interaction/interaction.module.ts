import {
	InteractionLoginService as ServiceInteractionLoginService,
	InteractionService as ServiceInteractionService,
} from "@cocrepo/service";
import {
	IDP_INTERACTION_LOGIN_SERVICE,
	IDP_INTERACTION_SERVICE,
	InteractionUseCaseProviders,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcModule } from "../oidc/oidc.module";
import { InteractionController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule, OidcModule],
	controllers: [InteractionController],
	providers: [
		...InteractionUseCaseProviders,
		ServiceInteractionLoginService,
		ServiceInteractionService,
		{
			provide: IDP_INTERACTION_LOGIN_SERVICE,
			useExisting: ServiceInteractionLoginService,
		},
		{
			provide: IDP_INTERACTION_SERVICE,
			useExisting: ServiceInteractionService,
		},
	],
	exports: [ServiceInteractionLoginService],
})
export class InteractionModule {}
