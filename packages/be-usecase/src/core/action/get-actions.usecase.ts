import { ActionAggregate } from "@cocrepo/aggregate";
import { GetActionsQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetActionsQuery)
export class GetActionsUseCase {
	constructor(private readonly actionsService: ActionAggregate) {}

	execute(query: GetActionsQuery): Promise<unknown> {
		return query.group
			? this.actionsService.getActionsByGroup(query.group)
			: this.actionsService.getAllActions();
	}
}
