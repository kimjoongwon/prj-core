import type { CreateCommunityPostPayloadDto } from "@cocrepo/dto";

export interface CommunityPostCreateInput {
	dto: CreateCommunityPostPayloadDto;
	spaceId: string;
	userId: string;
}
