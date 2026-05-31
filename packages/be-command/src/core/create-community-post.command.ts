import type { CreateCommunityPostPayloadDto } from "@cocrepo/dto";

export class CreateCommunityPostCommand {
	constructor(readonly dto: CreateCommunityPostPayloadDto) {}
}
