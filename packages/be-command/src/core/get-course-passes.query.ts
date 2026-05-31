import type { QueryCoursePassDto } from "@cocrepo/dto";

export class GetCoursePassesQuery {
	constructor(readonly query: QueryCoursePassDto) {}
}
