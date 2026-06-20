import { ActionAggregate } from "@cocrepo/aggregate";
import { UpdateActionCommand } from "@cocrepo/command";
import { ACTION_ERRORS } from "@cocrepo/constant";
import { BadRequestException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateActionCommand)
export class UpdateActionUseCase
	implements ICommandHandler<UpdateActionCommand>
{
	constructor(private readonly actionsService: ActionAggregate) {}

	async execute(command: UpdateActionCommand): Promise<unknown> {
		const existingAction = await this.actionsService.getActionById(
			command.actionId,
		);
		if (existingAction.isSystem) {
			throw new BadRequestException(
				ACTION_ERRORS.SYSTEM_ACTION_MODIFY_NOT_ALLOWED,
			);
		}
		const input = command.input;
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
			...(input.isSystem !== undefined && { isSystem: input.isSystem }),
			...(input.config !== undefined && { config: input.config }),
		});
	}
}
