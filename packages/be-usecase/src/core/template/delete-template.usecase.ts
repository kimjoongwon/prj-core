import { DeleteTemplateCommand } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteTemplateCommand)
export class DeleteTemplateUseCase {
	constructor(private readonly templateService: TemplateService) {}

	async execute(command: DeleteTemplateCommand): Promise<void> {
		await this.templateService.remove(command.templateId);
	}
}
