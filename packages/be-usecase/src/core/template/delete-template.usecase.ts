import { DeleteTemplateCommand } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteTemplateCommand)
export class DeleteTemplateUseCase
	implements ICommandHandler<DeleteTemplateCommand>
{
	constructor(private readonly templateService: TemplateService) {}

	async execute(command: DeleteTemplateCommand): Promise<void> {
		await this.templateService.remove(command.templateId);
	}
}
