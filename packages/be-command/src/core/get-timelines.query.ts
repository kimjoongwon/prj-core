import type { QueryTimelineDto } from "@cocrepo/dto";

export class GetTimelinesQuery {
	constructor(readonly query: QueryTimelineDto) {}
}
