import type { Prisma, SentimentType } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Inquiry } from "./inquiry.entity";
import type { InquiryMessage } from "./inquiry-message.entity";

/**
 * 문의 내용의 감정 분석 결과를 저장하는 엔티티
 *
 * AI 기반 감정 분석을 통해 고객의 감정 상태(긍정, 중립, 부정)와
 * 신뢰도를 추적합니다. 실시간 채팅에서 메시지별 감정 변화를 모니터링합니다.
 */
export class SentimentAnalysis extends AbstractEntity {
	/** 공개 식별자 ULID */
	sentimentAnalysisId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	inquiryId!: bigint;
	sentiment!: SentimentType;
	score!: number;
	confidence!: number;
	analyzedAt!: Date;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	messageId!: bigint | null;
	emotions!: Prisma.JsonValue | null;
	keywords!: Prisma.JsonValue | null;
	urgency!: number | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	inquiry?: Inquiry;
	message?: InquiryMessage | null;

	// ============================================================================
	// 감정 상태 확인 메서드
	// ============================================================================

	/**
	 * 긍정 감정 여부
	 */
	isPositive(): boolean {
		return this.sentiment === "POSITIVE";
	}

	/**
	 * 중립 감정 여부
	 */
	isNeutral(): boolean {
		return this.sentiment === "NEUTRAL";
	}

	/**
	 * 부정 감정 여부
	 */
	isNegative(): boolean {
		return this.sentiment === "NEGATIVE";
	}

	/**
	 * 긴급 여부 (urgency > 0.7)
	 */
	isUrgent(): boolean {
		return this.urgency !== null && this.urgency > 0.7;
	}

	/**
	 * 신뢰도 높음 여부 (confidence > 0.8)
	 */
	isReliable(): boolean {
		return this.confidence > 0.8;
	}

	/**
	 * 가장 강한 감정 반환
	 */
	getDominantEmotion(): string {
		if (!this.emotions || typeof this.emotions !== "object") return "";

		const emotions = this.emotions as Record<string, number>;
		const entries = Object.entries(emotions);
		if (entries.length === 0) return "";

		const sorted = entries.sort((a, b) => b[1] - a[1]);
		return sorted[0][0];
	}

	/**
	 * 분석 결과 업데이트
	 */
	updateAnalysis(result: {
		sentiment: SentimentType;
		score: number;
		confidence: number;
		emotions?: Prisma.JsonValue;
		keywords?: Prisma.JsonValue;
		urgency?: number;
	}): void {
		this.sentiment = result.sentiment;
		this.score = result.score;
		this.confidence = result.confidence;
		if (result.emotions) this.emotions = result.emotions;
		if (result.keywords) this.keywords = result.keywords;
		if (result.urgency !== undefined) this.urgency = result.urgency;
		this.analyzedAt = new Date();
	}
}
