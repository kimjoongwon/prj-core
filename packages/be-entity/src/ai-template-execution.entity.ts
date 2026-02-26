import type {
	AIProvider,
	AITemplateExecution as AITemplateExecutionEntity,
	ExecutionStatus,
	Prisma,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { AIFormTemplate } from "./ai-form-template.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

/**
 * AI 템플릿 실행 엔티티
 *
 * AI 폼 템플릿 실행 이력을 기록합니다.
 * 어떤 사용자가 어떤 템플릿을 사용했는지, 입력값과 결과값,
 * 실행 시간, 토큰 사용량 등을 추적합니다.
 */
export class AITemplateExecution
	extends AbstractEntity
	implements AITemplateExecutionEntity
{
	// ============================================================================
	// 필수 필드
	// ============================================================================
	templateId!: string;
	userId!: string;
	spaceId!: string;
	result!: Prisma.JsonValue;
	status!: ExecutionStatus;
	aiProvider!: AIProvider;
	model!: string;
	isApplied!: boolean;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	userInput!: Prisma.JsonValue | null;
	inputContext!: Prisma.JsonValue | null;
	errorMessage!: string | null;
	tokensUsed!: number | null;
	executionTimeMs!: number | null;
	appliedAt!: Date | null;
	targetEntityId!: string | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	template?: AIFormTemplate;
	user?: User;
	space?: Space;

	// ============================================================================
	// 상태 확인 메서드
	// ============================================================================

	/**
	 * 실행이 성공했는지 확인합니다
	 */
	isSuccess(): boolean {
		return this.status === "SUCCESS";
	}

	/**
	 * 실행이 실패했는지 확인합니다
	 */
	isFailed(): boolean {
		return this.status === "FAILED";
	}

	/**
	 * 실행이 대기 중인지 확인합니다
	 */
	isPending(): boolean {
		return this.status === "PENDING";
	}

	/**
	 * 실행 중인지 확인합니다
	 */
	isRunning(): boolean {
		return this.status === "RUNNING";
	}

	/**
	 * 타임아웃되었는지 확인합니다
	 */
	isTimeout(): boolean {
		return this.status === "TIMEOUT";
	}

	/**
	 * 취소되었는지 확인합니다
	 */
	isCancelled(): boolean {
		return this.status === "CANCELLED";
	}

	/**
	 * 결과를 적용할 수 있는지 확인합니다
	 */
	canApply(): boolean {
		return this.isSuccess() && !this.isApplied;
	}

	// ============================================================================
	// 상태 변경 메서드
	// ============================================================================

	/**
	 * 실행을 시작 상태로 변경합니다
	 */
	start(): void {
		this.status = "RUNNING";
	}

	/**
	 * 실행 완료 처리를 합니다
	 */
	complete(
		result: Prisma.JsonValue,
		tokensUsed?: number,
		executionTimeMs?: number,
	): void {
		this.status = "SUCCESS";
		this.result = result;
		if (tokensUsed !== undefined) {
			this.tokensUsed = tokensUsed;
		}
		if (executionTimeMs !== undefined) {
			this.executionTimeMs = executionTimeMs;
		}
	}

	/**
	 * 실행 실패 처리를 합니다
	 */
	fail(errorMessage: string): void {
		this.status = "FAILED";
		this.errorMessage = errorMessage;
	}

	/**
	 * 타임아웃 처리를 합니다
	 */
	timeout(): void {
		this.status = "TIMEOUT";
		this.errorMessage = "실행 시간이 초과되었습니다";
	}

	/**
	 * 실행 취소 처리를 합니다
	 */
	cancel(): void {
		this.status = "CANCELLED";
	}

	/**
	 * 결과 적용 처리를 합니다
	 */
	markApplied(targetEntityId: string): void {
		if (!this.canApply()) {
			throw new Error("SUCCESS 상태이고 미적용된 실행만 적용할 수 있습니다.");
		}
		this.isApplied = true;
		this.appliedAt = new Date();
		this.targetEntityId = targetEntityId;
	}

	// ============================================================================
	// 결과 조회 메서드
	// ============================================================================

	/**
	 * 특정 필드의 결과값을 반환합니다
	 */
	getFieldValue(fieldName: string): unknown {
		if (!this.result) return null;

		try {
			const result = this.result as Record<string, unknown>;
			return result[fieldName] ?? null;
		} catch {
			return null;
		}
	}

	/**
	 * 포맷팅된 전체 결과를 반환합니다
	 */
	getFormattedResult(): Record<string, unknown> {
		if (!this.result) return {};

		try {
			return this.result as Record<string, unknown>;
		} catch {
			return {};
		}
	}

	/**
	 * 사용자 입력을 반환합니다
	 */
	getUserInput(): Record<string, unknown> {
		if (!this.userInput) return {};

		try {
			return this.userInput as Record<string, unknown>;
		} catch {
			return {};
		}
	}

	/**
	 * 컨텍스트 데이터를 반환합니다
	 */
	getInputContext(): Record<string, unknown> {
		if (!this.inputContext) return {};

		try {
			return this.inputContext as Record<string, unknown>;
		} catch {
			return {};
		}
	}

	// ============================================================================
	// 유틸리티 메서드
	// ============================================================================

	/**
	 * 실행 상태 라벨을 반환합니다
	 */
	getStatusLabel(): string {
		switch (this.status) {
			case "PENDING":
				return "대기 중";
			case "RUNNING":
				return "실행 중";
			case "SUCCESS":
				return "성공";
			case "FAILED":
				return "실패";
			case "TIMEOUT":
				return "타임아웃";
			case "CANCELLED":
				return "취소됨";
			default:
				return "알 수 없음";
		}
	}

	/**
	 * AI 제공자 라벨을 반환합니다
	 */
	getProviderLabel(): string {
		switch (this.aiProvider) {
			case "OPENAI":
				return "OpenAI";
			case "ANTHROPIC":
				return "Anthropic";
			default:
				return "알 수 없음";
		}
	}

	/**
	 * 실행 시간을 포맷팅하여 반환합니다
	 */
	getFormattedExecutionTime(): string {
		if (this.executionTimeMs === null) return "-";

		if (this.executionTimeMs < 1000) {
			return `${this.executionTimeMs}ms`;
		}
		const seconds = this.executionTimeMs / 1000;
		if (seconds < 60) {
			return `${seconds.toFixed(1)}s`;
		}
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
	}
}
