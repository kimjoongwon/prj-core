import type { GetInquiryParticipantsQueryResult } from "@cocrepo/api/core/inquiries";
import type { DecimalId, InquiryParticipant } from "@cocrepo/type";

type InquiryParticipantResponse = NonNullable<
	GetInquiryParticipantsQueryResult["data"]
>[number];

/** SDK의 bigint·Date 응답을 문의 화면과 WebSocket 상태가 공유하는 표현으로 변환합니다. */
export function toInquiryParticipantState(
	participant: InquiryParticipantResponse,
	inquiryId: DecimalId,
): InquiryParticipant {
	return {
		id: participant.id.toString(),
		inquiryId,
		threadId: participant.threadId?.toString() ?? null,
		userId: participant.userId.toString(),
		role:
			participant.role === "CUSTOMER"
				? "CUSTOMER"
				: participant.role === "SUPERVISOR"
					? "SUPERVISOR"
					: "AGENT",
		isOnline: participant.isOnline,
		isTyping: participant.isTyping,
		unreadCount: participant.unreadCount,
		joinedAt: participant.joinedAt.toISOString(),
		lastSeenAt: participant.lastSeenAt?.toISOString() ?? null,
		lastReadAt: participant.lastReadAt?.toISOString() ?? null,
		leftAt: participant.leftAt?.toISOString() ?? null,
	};
}
