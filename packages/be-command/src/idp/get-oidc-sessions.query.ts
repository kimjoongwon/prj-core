import type { QueryOidcSessionDto } from "@cocrepo/dto";

export class GetOidcSessionsQuery {
	constructor(readonly query: QueryOidcSessionDto) {}
}
