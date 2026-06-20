import { ActionAggregate } from "@cocrepo/aggregate";
import { CreateActionCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateActionCommand)
export class CreateActionUseCase {
	constructor(private readonly actionsService: ActionAggregate) {}

	execute(command: CreateActionCommand): Promise<unknown> {
		const input = command.input;
		return this.actionsService.createAction({
			name: input.name,
			displayName: input.displayName,
			description: input.description,
			group: input.group,
			order: input.order,
			isSystem: input.isSystem,
			config: input.config,
		});
	}
}
