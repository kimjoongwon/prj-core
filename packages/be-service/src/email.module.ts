import { TemplatesRepository } from "@cocrepo/repository";
import { Module } from "@nestjs/common";
import {
	EmailProvider,
	EmailService,
	SmtpEmailProvider,
} from "./email.service/index";
import { TemplateService } from "./template.service/index";

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
