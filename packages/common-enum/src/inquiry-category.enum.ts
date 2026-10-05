import { InquiryCategory } from "./generated/prisma-enums";

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
