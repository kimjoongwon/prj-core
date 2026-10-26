import type { InquiryStatus } from "@cocrepo/prisma";

export class UpdateInquiryStatusCommand {
	constructor(
		readonly inquiryId: bigint,
		readonly status: InquiryStatus,
	) {}
}
