import { UpdateTemplateCommand } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateTemplateCommand)
export class UpdateTemplateUseCase {
	constructor(private readonly templateService: TemplateService) {}

	execute(command: UpdateTemplateCommand): Promise<unknown> {
		const input = command;
		return this.templateService.update(command.templateId, {
			name: input.name,
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
