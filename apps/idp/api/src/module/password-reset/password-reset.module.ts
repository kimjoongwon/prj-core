import { EmailModule } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { OidcModule } from "../oidc/oidc.module";
import { PasswordResetController } from "./password-reset.controller";
import { PasswordResetFacade } from "./password-reset.facade";
import { PasswordResetService } from "./password-reset.service";

@Module({
	imports: [OidcModule, EmailModule],
	controllers: [PasswordResetController],
	providers: [PasswordResetFacade, PasswordResetService],
})
export class PasswordResetModule {}
