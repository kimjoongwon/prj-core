import { ToggleTemplateStatusCommand } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(ToggleTemplateStatusCommand)
export class ToggleTemplateStatusUseCase {
	constructor(private readonly templateService: TemplateService) {}

	execute(command: ToggleTemplateStatusCommand): Promise<unknown> {
		return this.templateService.toggleStatus(command.templateId);
	}
}
