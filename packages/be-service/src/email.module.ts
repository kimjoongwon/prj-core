import { TemplatesRepository } from "@cocrepo/repository";
import { Module } from "@nestjs/common";
import {
	EmailProvider,
	EmailService,
	SmtpEmailProvider,
} from "./email.service";
import { TemplateService } from "./template.service";

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
