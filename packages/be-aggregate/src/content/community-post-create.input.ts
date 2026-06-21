import type { CreateCommunityPostPayloadDto } from "@cocrepo/dto";

export interface CommunityPostCreateInput {
	dto: CreateCommunityPostPayloadDto;
	tenantId: string;
	userId: string;
}
