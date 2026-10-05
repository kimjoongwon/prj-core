import type { CreateCommunityPostCommandInput } from "@cocrepo/input";
export class CreateCommunityPostCommand
	implements CreateCommunityPostCommandInput
{
	readonly title?: CreateCommunityPostCommandInput["title"];
	readonly text!: CreateCommunityPostCommandInput["text"];

	constructor(input: CreateCommunityPostCommandInput) {
		Object.assign(this, input);
	}
}
