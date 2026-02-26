/**
 * 문의 접수 채널 Enum
 * Prisma의 InquiryChannel과 호환됩니다.
 */
export const InquiryChannel = {
	WEB: "WEB",
	EMAIL: "EMAIL",
	CHAT: "CHAT",
	SMS: "SMS",
	PHONE: "PHONE",
	WALK_IN: "WALK_IN",
} as const;

export type InquiryChannel =
	(typeof InquiryChannel)[keyof typeof InquiryChannel];

/**
 * 문의 접수 채널 라벨
 */
export const InquiryChannelLabel: Record<InquiryChannel, string> = {
	WEB: "웹 폼",
	EMAIL: "이메일",
	CHAT: "채팅",
	SMS: "SMS",
	PHONE: "전화",
	WALK_IN: "방문",
};

/**
 * 문의 접수 채널 옵션 (Select 컴포넌트용)
 */
export const InquiryChannelOptions = Object.entries(InquiryChannel).map(
	([, value]) => ({
		value,
		text: InquiryChannelLabel[value],
	}),
);
