import type { InquiryCategory } from "@cocrepo/prisma";

export const INQUIRY_CATEGORY_LABELS: Record<InquiryCategory, string> = {
	GENERAL: "일반",
	DELIVERY: "배송",
	REFUND: "환불",
	PRODUCT: "상품",
	ACCOUNT: "계정",
	TECHNICAL: "기술",
	COMPLAINT: "불만",
	OTHER: "기타",
};
