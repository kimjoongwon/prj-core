import type { QueryCourseOfferingDto } from "@cocrepo/dto";

export class GetCourseOfferingsQuery {
	constructor(readonly query: QueryCourseOfferingDto) {}
}
