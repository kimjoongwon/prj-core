import { ActionAggregate } from "@cocrepo/aggregate";
import { UpdateActionCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateActionCommand)
export class UpdateActionUseCase {
	constructor(private readonly actionsService: ActionAggregate) {}

	execute(command: UpdateActionCommand): Promise<unknown> {
		const input = command;
		return this.actionsService.updateAction(command.actionId, {
			...(input.name !== undefined && { name: input.name }),
			...(input.displayName !== undefined && {
				displayName: input.displayName,
			}),
			...(input.description !== undefined && {
				description: input.description,
			}),
			...(input.group !== undefined && { group: input.group }),
			...(input.order !== undefined && { order: input.order }),
			...(input.config !== undefined && { config: input.config }),
		});
	}
}
