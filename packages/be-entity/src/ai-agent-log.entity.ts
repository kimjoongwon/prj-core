import type {
	AIAgentAction,
	AIAgentLog as AIAgentLogEntity,
	Prisma,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Inquiry } from "./inquiry.entity";
import type { InquiryMessage } from "./inquiry-message.entity";

/**
 * AI 에이전트의 활동 로그를 기록하는 엔티티
 *
 * AI 초안 생성, 자동 분류, 감정 분석, 자동 응답 등
 * AI 기능 사용 내역을 추적하여 AI 성능 모니터링 및 감사 로그를 제공합니다.
 */
export class AIAgentLog extends AbstractEntity implements AIAgentLogEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	inquiryId!: string;
	action!: AIAgentAction;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	messageId!: string | null;
	input!: Prisma.JsonValue | null;
	output!: Prisma.JsonValue | null;
	confidence!: number | null;
	wasAccepted!: boolean | null;
	wasModified!: boolean | null;
	responseTimeMs!: number | null;
	model!: string | null;
	tokenCount!: number | null;
	errorMessage!: string | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	inquiry?: Inquiry;
	message?: InquiryMessage | null;

	// ============================================================================
	// 상태 확인 메서드
	// ============================================================================

	/**
	 * 성공 여부 (errorMessage 없음)
	 */
	isSuccessful(): boolean {
		return this.errorMessage === null;
	}

	/**
	 * 사용자 수락 여부
	 */
	wasAcceptedByUser(): boolean {
		return this.wasAccepted === true;
	}

	/**
	 * 사용자 수정 여부
	 */
	wasModifiedByUser(): boolean {
		return this.wasModified === true;
	}

	/**
	 * 높은 신뢰도 (confidence > 0.8)
	 */
	isHighConfidence(): boolean {
		return this.confidence !== null && this.confidence > 0.8;
	}

	/**
	 * 빠른 응답 (responseTimeMs < 2000)
	 */
	wasFast(): boolean {
		return this.responseTimeMs !== null && this.responseTimeMs < 2000;
	}
}
