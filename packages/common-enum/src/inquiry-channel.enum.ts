import { InquiryChannel } from "@cocrepo/prisma/enums";

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
