/**
 * 문의 카테고리 Enum
 * Prisma의 InquiryCategory와 호환됩니다.
 */
export const InquiryCategory = {
	GENERAL: "GENERAL",
	DELIVERY: "DELIVERY",
	REFUND: "REFUND",
	PRODUCT: "PRODUCT",
	ACCOUNT: "ACCOUNT",
	TECHNICAL: "TECHNICAL",
	COMPLAINT: "COMPLAINT",
	OTHER: "OTHER",
} as const;

export type InquiryCategory =
	(typeof InquiryCategory)[keyof typeof InquiryCategory];

/**
 * 문의 카테고리 라벨
 */
export const InquiryCategoryLabel: Record<InquiryCategory, string> = {
	GENERAL: "일반",
	DELIVERY: "배송",
	REFUND: "환불/취소",
	PRODUCT: "상품",
	ACCOUNT: "계정",
	TECHNICAL: "기술 지원",
	COMPLAINT: "불만/불편",
	OTHER: "기타",
};

/**
 * 문의 카테고리 옵션 (Select 컴포넌트용)
 */
export const InquiryCategoryOptions = Object.entries(InquiryCategory).map(
	([, value]) => ({
		value,
		text: InquiryCategoryLabel[value],
	}),
);
