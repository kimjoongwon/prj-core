import { SendTestTemplateCommand } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(SendTestTemplateCommand)
export class SendTestTemplateUseCase
	implements ICommandHandler<SendTestTemplateCommand>
{
	constructor(private readonly templateService: TemplateService) {}

	async execute(command: SendTestTemplateCommand): Promise<unknown> {
		return this.templateService.sendTest(command.templateId, command.dto);
	}
}
