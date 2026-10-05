import { InteractionController } from "@cocrepo/controller";
import {
	InteractionLoginService,
	InteractionService,
	OidcRedirectUrlService,
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
		InteractionLoginService,
		InteractionService,
		OidcRedirectUrlService,
	],
	exports: [InteractionLoginService],
})
export class InteractionModule {}
