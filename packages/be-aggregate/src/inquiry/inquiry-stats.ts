import type { InquiryCategory, InquiryStatus } from "@cocrepo/prisma";

export interface InquiryStats {
	byStatus: { status: InquiryStatus; count: number }[];
	byCategory: { category: InquiryCategory; count: number }[];
	overdue: {
		responseOverdue: number;
		resolveOverdue: number;
		total: number;
	};
}
