import type { Prisma } from "@cocrepo/prisma";

export class UpdateInquiryCommand {
	constructor(
		readonly inquiryId: string,
		readonly data: Prisma.InquiryUncheckedUpdateInput,
	) {}
}
