import { ToggleTemplateStatusCommand } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(ToggleTemplateStatusCommand)
export class ToggleTemplateStatusUseCase
	implements ICommandHandler<ToggleTemplateStatusCommand>
{
	constructor(private readonly templateService: TemplateService) {}

	execute(command: ToggleTemplateStatusCommand): Promise<unknown> {
		return this.templateService.toggleStatus(command.templateId);
	}
}
