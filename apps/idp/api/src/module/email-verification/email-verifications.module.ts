import { EmailVerificationFacade } from "@cocrepo/facade";
import {
	EmailVerificationsRepository,
	TemplatesRepository,
} from "@cocrepo/repository";
import {
	EmailProvider,
	EmailService,
	EmailVerificationService,
	SmtpEmailProvider,
	TemplateService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { EmailVerificationsController } from "./email-verifications.controller";

@Module({
	controllers: [EmailVerificationsController],
	providers: [
		EmailVerificationFacade,
		EmailVerificationService,
		EmailVerificationsRepository,
		SmtpEmailProvider,
		TemplateService,
		TemplatesRepository,
		{
			provide: EmailProvider,
			useExisting: SmtpEmailProvider,
		},
		EmailService,
	],
	exports: [EmailVerificationFacade],
})
export class EmailVerificationsModule {}
