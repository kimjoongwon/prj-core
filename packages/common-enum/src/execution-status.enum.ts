/**
 * AI 실행 상태 Enum
 * Prisma의 ExecutionStatus와 호환됩니다.
 */
export const ExecutionStatus = {
	PENDING: "PENDING",
	RUNNING: "RUNNING",
	SUCCESS: "SUCCESS",
	FAILED: "FAILED",
	TIMEOUT: "TIMEOUT",
	CANCELLED: "CANCELLED",
} as const;

export type ExecutionStatus =
	(typeof ExecutionStatus)[keyof typeof ExecutionStatus];

/**
 * AI 실행 상태 라벨
 */
export const ExecutionStatusLabel: Record<ExecutionStatus, string> = {
	PENDING: "대기 중",
	RUNNING: "실행 중",
	SUCCESS: "성공",
	FAILED: "실패",
	TIMEOUT: "시간 초과",
	CANCELLED: "취소됨",
};
