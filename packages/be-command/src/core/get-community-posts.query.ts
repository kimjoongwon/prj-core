import type { QueryCommunityPostsDto } from "@cocrepo/dto";

export class GetCommunityPostsQuery {
	constructor(readonly query: QueryCommunityPostsDto) {}
}
