import { EmailVerificationAggregateRoot } from "@cocrepo/aggregate";
import {
	EmailVerificationsRepository,
	TemplatesRepository,
} from "@cocrepo/repository";
import {
	EmailProvider,
	EmailService,
	SmtpEmailProvider,
	TemplateService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { EmailVerificationsController } from "./email-verifications.controller";
import { EmailVerificationUseCaseProviders } from "@cocrepo/usecase";

@Module({
	imports: [CqrsModule],
	controllers: [EmailVerificationsController],
	providers: [
		...EmailVerificationUseCaseProviders,
		EmailVerificationAggregateRoot,
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
})
export class EmailVerificationsModule {}
