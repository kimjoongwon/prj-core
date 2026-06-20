import { ActionAggregate } from "@cocrepo/aggregate";
import { DeleteActionCommand } from "@cocrepo/command";
import { ACTION_ERRORS } from "@cocrepo/constant";
import { BadRequestException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteActionCommand)
export class DeleteActionUseCase {
	constructor(private readonly actionsService: ActionAggregate) {}

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
