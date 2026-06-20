import { UpdateTemplateCommand } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateTemplateCommand)
export class UpdateTemplateUseCase {
	constructor(private readonly templateService: TemplateService) {}

	execute(command: UpdateTemplateCommand): Promise<unknown> {
		return this.templateService.update(command.templateId, command.input);
	}
}
