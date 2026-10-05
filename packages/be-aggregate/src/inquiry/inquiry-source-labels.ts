import type { InquirySource } from "@cocrepo/prisma";

export const INQUIRY_SOURCE_LABELS: Record<InquirySource, string> = {
	ONLINE: "온라인",
	OFFLINE: "오프라인",
};
