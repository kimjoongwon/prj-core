import { UpdateTemplateCommand } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateTemplateCommand)
export class UpdateTemplateUseCase
	implements ICommandHandler<UpdateTemplateCommand>
{
	constructor(private readonly templateService: TemplateService) {}

	execute(command: UpdateTemplateCommand): Promise<unknown> {
		return this.templateService.update(command.templateId, command.dto);
	}
}
