import { CreateTemplateCommand } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateTemplateCommand)
export class CreateTemplateUseCase
	implements ICommandHandler<CreateTemplateCommand>
{
	constructor(private readonly templateService: TemplateService) {}

	execute(command: CreateTemplateCommand): Promise<unknown> {
		return this.templateService.create(command.input);
	}
}
