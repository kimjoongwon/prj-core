import { InteractionController } from "@cocrepo/controller";
import {
	IDP_INTERACTION_LOGIN_SERVICE,
	InteractionService,
	OidcRedirectUrlService,
	InteractionLoginService as ServiceInteractionLoginService,
} from "@cocrepo/service";
import { InteractionUseCaseProviders } from "@cocrepo/usecase";
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
		OidcRedirectUrlService,
		{
			provide: IDP_INTERACTION_LOGIN_SERVICE,
			useExisting: ServiceInteractionLoginService,
		},
	],
	exports: [ServiceInteractionLoginService],
})
export class InteractionModule {}
