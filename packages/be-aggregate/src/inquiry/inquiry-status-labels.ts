import type { InquiryStatus } from "@cocrepo/prisma";

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
	NEW: "신규",
	OPEN: "열림",
	IN_PROGRESS: "진행중",
	WAITING_CUSTOMER: "고객대기",
	RESOLVED: "해결",
	CLOSED: "종료",
	ESCALATED: "에스컬레이션",
};
