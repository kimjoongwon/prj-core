/**
 * 문의 우선순위 Enum
 * Prisma의 InquiryPriority와 호환됩니다.
 */
export const InquiryPriority = {
	LOW: "LOW",
	NORMAL: "NORMAL",
	HIGH: "HIGH",
	URGENT: "URGENT",
} as const;

export type InquiryPriority =
	(typeof InquiryPriority)[keyof typeof InquiryPriority];

/**
 * 문의 우선순위 라벨
 */
export const InquiryPriorityLabel: Record<InquiryPriority, string> = {
	LOW: "낮음",
	NORMAL: "보통",
	HIGH: "높음",
	URGENT: "긴급",
};

/**
 * 문의 우선순위 옵션 (Select 컴포넌트용)
 */
export const InquiryPriorityOptions = Object.entries(InquiryPriority).map(
	([, value]) => ({
		value,
		text: InquiryPriorityLabel[value],
	}),
);
