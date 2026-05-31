import type { QueryEnrollmentDto } from "@cocrepo/dto";

export class GetEnrollmentsQuery {
	constructor(readonly query: QueryEnrollmentDto) {}
}
