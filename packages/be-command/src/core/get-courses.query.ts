import type { QueryCourseDto } from "@cocrepo/dto";

export class GetCoursesQuery {
	constructor(readonly query: QueryCourseDto) {}
}
