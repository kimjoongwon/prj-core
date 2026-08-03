import { ActionAggregate } from "@cocrepo/aggregate";
import { DeleteActionCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteActionCommand)
export class DeleteActionUseCase {
	constructor(private readonly actionsService: ActionAggregate) {}

	execute(command: DeleteActionCommand): Promise<unknown> {
		return this.actionsService.deleteAction(command.actionId);
	}
}
