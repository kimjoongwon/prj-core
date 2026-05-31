import { TaskAggregateRoot } from "@cocrepo/aggregate";
import { FindTasksQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { Logger } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindTasksQuery)
export class FindTasksUseCase implements IQueryHandler<FindTasksQuery> {
	private readonly logger = new Logger(FindTasksUseCase.name);

	constructor(private readonly taskService: TaskAggregateRoot) {}

	async execute(query: FindTasksQuery): Promise<unknown> {
		this.logger.debug("Task 목록 조회");
		const skip = query.params.skip ?? 0;
		const take = query.params.take ?? 10;
		const taskResult = await this.taskService.findTasks({
			...query.params,
			skip,
			take,
		});
		return buildOffsetPaginatedResponse(
			taskResult.tasks,
			taskResult.total,
			skip,
			take,
		);
	}
}
