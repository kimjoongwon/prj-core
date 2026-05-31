import { ActionAggregateRoot } from "@cocrepo/aggregate";
import { CreateActionCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateActionCommand)
export class CreateActionUseCase
	implements ICommandHandler<CreateActionCommand>
{
	constructor(private readonly actionsService: ActionAggregateRoot) {}

	execute(command: CreateActionCommand): Promise<unknown> {
		const dto = command.dto;
		return this.actionsService.createAction({
			name: dto.name,
			displayName: dto.displayName,
			description: dto.description,
			group: dto.group,
			order: dto.order,
			isSystem: dto.isSystem,
			config: dto.config,
		});
	}
}
