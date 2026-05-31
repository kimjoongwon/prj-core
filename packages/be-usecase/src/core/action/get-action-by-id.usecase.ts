import { ActionAggregateRoot } from "@cocrepo/aggregate";
import { GetActionByIdQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetActionByIdQuery)
export class GetActionByIdUseCase implements IQueryHandler<GetActionByIdQuery> {
	constructor(private readonly actionsService: ActionAggregateRoot) {}

	execute(query: GetActionByIdQuery): Promise<unknown> {
		return this.actionsService.getActionById(query.actionId);
	}
}
