import { RoutineAggregate } from "@cocrepo/aggregate";
import { GetRoutinesQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRoutinesQuery)
export class GetRoutinesUseCase {
	constructor(private readonly routinesService: RoutineAggregate) {}

	async execute(query: GetRoutinesQuery): Promise<unknown> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const spaceScope =
			query.spaceScope ?? ("CURRENT" as NonNullable<typeof query.spaceScope>);
		const routineResult = await this.routinesService.findRoutines({
			spaceScope,
			skip,
			take,
			search: query.search,
			contentLanguageCode: query.contentLanguageCode,
		});
		return buildOffsetPaginatedResponse(
			routineResult.routines,
			routineResult.total,
			skip,
			take,
		);
	}
}
