import { TaskAggregate } from "@cocrepo/aggregate";
import { FindTasksQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { Logger } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindTasksQuery)
export class FindTasksUseCase {
	private readonly logger = new Logger(FindTasksUseCase.name);

	constructor(private readonly taskService: TaskAggregate) {}

	async execute(query: FindTasksQuery): Promise<unknown> {
		this.logger.debug("Task 목록 조회");
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const taskResult = await this.taskService.findTasks({
			...query,
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
