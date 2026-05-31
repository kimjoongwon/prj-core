import type { InquiryChannel } from "@cocrepo/prisma";

export const INQUIRY_CHANNEL_LABELS: Record<InquiryChannel, string> = {
	WEB: "웹",
	EMAIL: "이메일",
	CHAT: "채팅",
	SMS: "문자",
	PHONE: "전화",
	WALK_IN: "방문",
};
