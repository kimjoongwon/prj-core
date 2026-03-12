import { EmailService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { OidcModule } from "../oidc/oidc.module";
import { PasswordResetController } from "./password-reset.controller";
import { PasswordResetApplicationService } from "./password-reset.application-service";
import { PasswordResetService } from "./password-reset.service";

@Module({
	imports: [OidcModule],
	controllers: [PasswordResetController],
	providers: [PasswordResetApplicationService, PasswordResetService, EmailService],
})
export class PasswordResetModule {}
