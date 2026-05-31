import type { QueryProgramDto } from "@cocrepo/dto";

export class GetProgramsQuery {
	constructor(
		readonly sessionId: string,
		readonly query: QueryProgramDto,
	) {}
}
