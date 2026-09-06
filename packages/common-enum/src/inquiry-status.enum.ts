import { InquiryStatus } from "@cocrepo/prisma/enums";

/**
 * 문의 처리 상태 라벨
 */
export const InquiryStatusLabel: Record<InquiryStatus, string> = {
	NEW: "신규",
	OPEN: "열림",
	IN_PROGRESS: "처리 중",
	WAITING_CUSTOMER: "고객 대기",
	RESOLVED: "해결됨",
	CLOSED: "종료됨",
	ESCALATED: "에스컬레이션",
};

/**
 * 문의 처리 상태 옵션 (Select 컴포넌트용)
 */
export const InquiryStatusOptions = Object.entries(InquiryStatus).map(
	([, value]) => ({
		value,
		text: InquiryStatusLabel[value],
	}),
);

/**
 * 상태 전환 규칙
 * 각 상태에서 전환 가능한 상태 목록을 정의합니다.
 */
export const InquiryStatusTransitions: Record<InquiryStatus, InquiryStatus[]> =
	{
		NEW: [InquiryStatus.OPEN, InquiryStatus.ESCALATED],
		OPEN: [
			InquiryStatus.IN_PROGRESS,
			InquiryStatus.WAITING_CUSTOMER,
			InquiryStatus.ESCALATED,
		],
		IN_PROGRESS: [
			InquiryStatus.WAITING_CUSTOMER,
			InquiryStatus.RESOLVED,
			InquiryStatus.ESCALATED,
		],
		WAITING_CUSTOMER: [
			InquiryStatus.IN_PROGRESS,
			InquiryStatus.RESOLVED,
			InquiryStatus.ESCALATED,
		],
		RESOLVED: [InquiryStatus.CLOSED],
		CLOSED: [], // 종료 상태는 재오픈 불가
		ESCALATED: [InquiryStatus.RESOLVED], // 에스컬레이션은 해결로만 전환 가능
	};

/**
 * 현재 상태에서 전환 가능한 상태 옵션을 반환합니다.
 */
export const getAllowedStatusOptions = (
	currentStatus?: InquiryStatus,
): Array<{ value: string; text: string }> => {
	if (!currentStatus) {
		return InquiryStatusOptions;
	}

	const allowedStatuses = InquiryStatusTransitions[currentStatus] || [];
	return allowedStatuses.map((status) => ({
		value: status,
		text: InquiryStatusLabel[status],
	}));
};
