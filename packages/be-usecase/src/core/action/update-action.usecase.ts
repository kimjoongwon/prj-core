import { ActionAggregateRoot } from "@cocrepo/aggregate";
import { UpdateActionCommand } from "@cocrepo/command";
import { ACTION_ERRORS } from "@cocrepo/constant";
import { BadRequestException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateActionCommand)
export class UpdateActionUseCase
	implements ICommandHandler<UpdateActionCommand>
{
	constructor(private readonly actionsService: ActionAggregateRoot) {}

	async execute(command: UpdateActionCommand): Promise<unknown> {
		const existingAction = await this.actionsService.getActionById(
			command.actionId,
		);
		if (existingAction.isSystem) {
			throw new BadRequestException(
				ACTION_ERRORS.SYSTEM_ACTION_MODIFY_NOT_ALLOWED,
			);
		}
		const dto = command.dto;
		return this.actionsService.updateAction(command.actionId, {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.displayName !== undefined && { displayName: dto.displayName }),
			...(dto.description !== undefined && { description: dto.description }),
			...(dto.group !== undefined && { group: dto.group }),
			...(dto.order !== undefined && { order: dto.order }),
			...(dto.isSystem !== undefined && { isSystem: dto.isSystem }),
			...(dto.config !== undefined && { config: dto.config }),
		});
	}
}
