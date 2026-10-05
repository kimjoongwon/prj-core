import { TemplatesRepository } from "@cocrepo/repository";
import { Module } from "@nestjs/common";
import { TemplateService } from "../template/template.service";
import { EmailService } from "./email.service";
import { EmailProvider } from "./email-provider";
import { SmtpEmailProvider } from "./smtp-email-provider";

@Module({
	providers: [
		SmtpEmailProvider,
		TemplateService,
		TemplatesRepository,
		{
			provide: EmailProvider,
			useExisting: SmtpEmailProvider,
		},
		EmailService,
	],
	exports: [EmailProvider, EmailService],
})
export class EmailModule {}
