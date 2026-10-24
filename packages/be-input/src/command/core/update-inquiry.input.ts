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
	assigneeId?: string;
	isRealtimeChat?: boolean;
}
