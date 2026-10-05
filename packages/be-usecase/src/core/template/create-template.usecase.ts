import { CreateTemplateCommand } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateTemplateCommand)
export class CreateTemplateUseCase {
	constructor(private readonly templateService: TemplateService) {}

	execute(command: CreateTemplateCommand): Promise<unknown> {
		const input = command;
		return this.templateService.create({
			code: input.code,
			name: input.name,
			type: input.type,
			subject: input.subject,
			content: input.content,
			description: input.description,
			variables: input.variables?.map((variable) => ({
				name: variable.name,
				description: variable.description,
				defaultValue: variable.defaultValue,
				isRequired: variable.isRequired,
			})),
		});
	}
}
