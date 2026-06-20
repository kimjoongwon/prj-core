import { PasswordResetController } from "@cocrepo/controller";
import {
	EmailModule,
	IDP_PASSWORD_RESET_SERVICE,
	PasswordResetService,
} from "@cocrepo/service";
import { PasswordResetUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcModule } from "../oidc/oidc.module";

@Module({
	imports: [CqrsModule, OidcModule, EmailModule],
	controllers: [PasswordResetController],
	providers: [
		...PasswordResetUseCaseProviders,
		PasswordResetService,
		{
			provide: IDP_PASSWORD_RESET_SERVICE,
			useExisting: PasswordResetService,
		},
	],
})
export class PasswordResetModule {}
