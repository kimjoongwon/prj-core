import { EmailModule } from "@cocrepo/service";
import {
	IDP_PASSWORD_RESET_SERVICE,
	PasswordResetUseCaseProviders,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcModule } from "../oidc/oidc.module";
import { PasswordResetController } from "./password-reset.controller";
import { PasswordResetService } from "./password-reset.service";

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
