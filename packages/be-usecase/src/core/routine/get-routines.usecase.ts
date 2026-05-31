import { RoutineAggregateRoot } from "@cocrepo/aggregate";
import { GetRoutinesQuery } from "@cocrepo/command";
import { SpaceScope as SpaceScopeEnum } from "@cocrepo/dto";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRoutinesQuery)
export class GetRoutinesUseCase implements IQueryHandler<GetRoutinesQuery> {
	constructor(private readonly routinesService: RoutineAggregateRoot) {}

	async execute(query: GetRoutinesQuery): Promise<unknown> {
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
		const spaceScope = query.query.spaceScope ?? SpaceScopeEnum.CURRENT;
		const routineResult = await this.routinesService.findRoutines({
			spaceScope,
			skip,
			take,
			search: query.query.search,
			contentLanguageCode: query.query.contentLanguageCode,
		});
		return buildOffsetPaginatedResponse(
			routineResult.routines,
			routineResult.total,
			skip,
			take,
		);
	}
}
