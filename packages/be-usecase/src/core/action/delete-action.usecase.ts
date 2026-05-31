import { ActionAggregateRoot } from "@cocrepo/aggregate";
import { DeleteActionCommand } from "@cocrepo/command";
import { ACTION_ERRORS } from "@cocrepo/constant";
import { BadRequestException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteActionCommand)
export class DeleteActionUseCase
	implements ICommandHandler<DeleteActionCommand>
{
	constructor(private readonly actionsService: ActionAggregateRoot) {}

	async execute(command: DeleteActionCommand): Promise<unknown> {
		const existingAction = await this.actionsService.getActionById(
			command.actionId,
		);
		if (existingAction.isSystem) {
			throw new BadRequestException(
				ACTION_ERRORS.SYSTEM_ACTION_DELETE_NOT_ALLOWED,
			);
		}
		return this.actionsService.deleteAction(command.actionId);
	}
}
