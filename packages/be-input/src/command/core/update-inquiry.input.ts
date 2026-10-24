import type {
	InquiryCategory,
	InquiryPriority,
	InquiryStatus,
} from "@cocrepo/prisma";

export interface UpdateInquiryCommandInput {
	title?: string;
	category?: InquiryCategory;
	status?: InquiryStatus;
	priority?: InquiryPriority;
	assigneeSeq?: bigint;
	isRealtimeChat?: boolean;
}
