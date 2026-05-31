import type { InquiryPriority } from "@cocrepo/prisma";

export const INQUIRY_PRIORITY_LABELS: Record<InquiryPriority, string> = {
	LOW: "낮음",
	NORMAL: "보통",
	HIGH: "높음",
	URGENT: "긴급",
};
