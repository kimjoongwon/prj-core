import type { QueryUsersDto } from "@cocrepo/dto";

export class GetUsersBySpaceQuery {
	constructor(readonly query: QueryUsersDto) {}
}
