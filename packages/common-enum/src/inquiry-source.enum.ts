import { InquirySource } from "@cocrepo/prisma/enums";

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
