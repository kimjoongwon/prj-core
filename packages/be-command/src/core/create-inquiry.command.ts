import type { CreateInquiryDto } from "@cocrepo/dto";

export class CreateInquiryCommand {
	constructor(
		readonly dto: CreateInquiryDto,
		readonly spaceId: string,
		readonly actorUserId: string,
	) {}
}
