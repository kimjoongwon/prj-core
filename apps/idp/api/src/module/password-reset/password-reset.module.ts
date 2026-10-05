import { PasswordResetController } from "@cocrepo/controller";
import { EmailModule, PasswordResetService } from "@cocrepo/service";
import { PasswordResetUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcModule } from "../oidc/oidc.module";

@Module({
	imports: [CqrsModule, OidcModule, EmailModule],
	controllers: [PasswordResetController],
	providers: [...PasswordResetUseCaseProviders, PasswordResetService],
})
export class PasswordResetModule {}
