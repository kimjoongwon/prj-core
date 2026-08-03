import type { InquiryPriority } from "@cocrepo/prisma";

export class UpdateInquiryPriorityCommand {
	constructor(
		readonly inquiryId: bigint,
		readonly priority: InquiryPriority,
	) {}
}
