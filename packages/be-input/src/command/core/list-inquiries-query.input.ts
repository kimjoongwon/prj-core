import type {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
	InquiryStatus,
} from "@cocrepo/prisma";

export interface ListInquiriesQueryInput {
	search?: string;
	status?: "active" | "deleted";
	category?: InquiryCategory;
	channel?: InquiryChannel;
	priority?: InquiryPriority;
	inquiryStatus?: InquiryStatus;
	customerId?: string;
	assigneeId?: string;
	spaceIds?: string[];
	startDate?: Date;
	endDate?: Date;
	sort?: string[];
	skip?: number;
	take?: number;
}
