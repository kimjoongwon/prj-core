import type { QuerySessionDto } from "@cocrepo/dto";

export class GetSessionsQuery {
	constructor(
		readonly timelineId: string,
		readonly query: QuerySessionDto,
	) {}
}
