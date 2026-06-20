import { EmailVerificationAggregate } from "@cocrepo/aggregate";
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
import { EmailVerificationUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { EmailVerificationsController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [EmailVerificationsController],
	providers: [
		...EmailVerificationUseCaseProviders,
		EmailVerificationAggregate,
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
