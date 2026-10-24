import type { InquiryStatus } from "@cocrepo/prisma";

export class UpdateInquiryStatusCommand {
	constructor(
		readonly inquiryId: string,
		readonly status: InquiryStatus,
	) {}
}
