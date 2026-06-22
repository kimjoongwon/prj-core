import type { GetCommunityPostsQueryInput } from "@cocrepo/input";

export class GetCommunityPostsQuery implements GetCommunityPostsQueryInput {
	readonly skip?: GetCommunityPostsQueryInput["skip"];
	readonly take?: GetCommunityPostsQueryInput["take"];

	constructor(input: GetCommunityPostsQueryInput) {
		Object.assign(this, input);
	}
}
