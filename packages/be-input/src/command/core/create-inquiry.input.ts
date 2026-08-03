import type {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
	InquirySource,
} from "@cocrepo/prisma";

export interface CreateInquiryCommandInput {
	title: string;
	category: InquiryCategory;
	channel: InquiryChannel;
	source?: InquirySource;
	priority?: InquiryPriority;
	customerId?: bigint;
	assigneeId?: bigint;
	content?: string;
}
