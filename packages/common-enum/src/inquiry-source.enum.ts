/**
 * 문의 접수 유형 Enum
 * Prisma의 InquirySource와 호환됩니다.
 */
export const InquirySource = {
	ONLINE: "ONLINE",
	OFFLINE: "OFFLINE",
} as const;

export type InquirySource = (typeof InquirySource)[keyof typeof InquirySource];

/**
 * 문의 접수 유형 라벨
 */
export const InquirySourceLabel: Record<InquirySource, string> = {
	ONLINE: "온라인 문의",
	OFFLINE: "오프라인 문의",
};

/**
 * 문의 접수 유형 옵션 (Select 컴포넌트용)
 */
export const InquirySourceOptions = Object.entries(InquirySource).map(
	([, value]) => ({
		value,
		text: InquirySourceLabel[value],
	}),
);
