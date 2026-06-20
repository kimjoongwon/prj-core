import { CreateTemplateCommand } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateTemplateCommand)
export class CreateTemplateUseCase {
	constructor(private readonly templateService: TemplateService) {}

	execute(command: CreateTemplateCommand): Promise<unknown> {
		return this.templateService.create(command.input);
	}
}
