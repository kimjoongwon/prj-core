import { ActionAggregateRoot } from "@cocrepo/aggregate";
import { GetActionsQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetActionsQuery)
export class GetActionsUseCase implements IQueryHandler<GetActionsQuery> {
	constructor(private readonly actionsService: ActionAggregateRoot) {}

	execute(query: GetActionsQuery): Promise<unknown> {
		return query.group
			? this.actionsService.getActionsByGroup(query.group)
			: this.actionsService.getAllActions();
	}
}
