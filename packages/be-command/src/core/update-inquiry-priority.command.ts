import type { InquiryPriority } from "@cocrepo/prisma";

export class UpdateInquiryPriorityCommand {
	constructor(
		readonly inquirySeq: bigint,
		readonly priority: InquiryPriority,
	) {}
}
