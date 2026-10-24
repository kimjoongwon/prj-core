import type { InquiryStatus } from "@cocrepo/prisma";

export class UpdateInquiryStatusCommand {
	constructor(
		readonly inquirySeq: bigint,
		readonly status: InquiryStatus,
	) {}
}
