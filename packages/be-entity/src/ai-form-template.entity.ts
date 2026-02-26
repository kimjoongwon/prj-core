import type {
	AIFormTemplate as AIFormTemplateEntity,
	AIProvider,
	AITemplateStatus,
	Prisma,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { AIFormField } from "./ai-form-field.entity";
import type { AITemplateExecution } from "./ai-template-execution.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

/**
 * AI 폼 템플릿 엔티티
 *
 * AI가 폼 필드를 자동으로 채우기 위한 템플릿을 정의합니다.
 * 관리자가 특정 도메인(Member, Inquiry, Role 등)을 대상으로
 * AI가 채울 필드와 각 필드별 프롬프트를 설정할 수 있습니다.
 */
export class AIFormTemplate
	extends AbstractEntity
	implements AIFormTemplateEntity
{
	// ============================================================================
	// 필수 필드
	// ============================================================================
	spaceId!: string;
	name!: string;
	targetDomain!: string;
	targetEntity!: string;
	aiProvider!: AIProvider;
	status!: AITemplateStatus;
	priority!: number;
	allowUserPrompt!: boolean;
	createdById!: string;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	description!: string | null;
	model!: string | null;
	systemPrompt!: string | null;
	maxTokens!: number | null;
	temperature!: number | null;
	metadata!: Prisma.JsonValue | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	createdBy?: User;
	fields?: AIFormField[];
	executions?: AITemplateExecution[];

	// ============================================================================
	// 상태 확인 메서드
	// ============================================================================

	/**
	 * 활성화된 템플릿인지 확인합니다
	 */
	isActiveTemplate(): boolean {
		return this.status === "ACTIVE" && this.removedAt === null;
	}

	/**
	 * 특정 AI 제공자를 사용할 수 있는지 확인합니다
	 */
	canUseProvider(provider: AIProvider): boolean {
		return this.aiProvider === provider;
	}

	/**
	 * 초안 상태인지 확인합니다
	 */
	isDraft(): boolean {
		return this.status === "DRAFT";
	}

	/**
	 * 비활성화 상태인지 확인합니다
	 */
	isInactive(): boolean {
		return this.status === "INACTIVE";
	}

	/**
	 * 보관된 상태인지 확인합니다
	 */
	isArchived(): boolean {
		return this.status === "ARCHIVED";
	}

	// ============================================================================
	// 상태 변경 메서드
	// ============================================================================

	/**
	 * 템플릿을 활성화합니다
	 */
	activate(): void {
		this.status = "ACTIVE";
	}

	/**
	 * 템플릿을 비활성화합니다
	 */
	deactivate(): void {
		this.status = "INACTIVE";
	}

	/**
	 * 템플릿을 보관합니다
	 */
	archive(): void {
		this.status = "ARCHIVED";
	}

	// ============================================================================
	// 프롬프트 관련 메서드
	// ============================================================================

	/**
	 * 시스템 프롬프트를 조합하여 반환합니다
	 */
	buildSystemPrompt(): string {
		const basePrompt = this.systemPrompt || "";
		const domainInfo = `대상 도메인: ${this.targetDomain}`;
		const entityInfo = `대상 Entity: ${this.targetEntity}`;

		return `${basePrompt}\n\n${domainInfo}\n${entityInfo}`.trim();
	}

	/**
	 * 사용 가능한 모델 목록을 반환합니다
	 */
	getAvailableModels(): string[] {
		const openaiModels = ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"];
		const anthropicModels = [
			"claude-3-opus",
			"claude-3-sonnet",
			"claude-3-haiku",
		];

		if (this.aiProvider === "OPENAI") {
			return openaiModels;
		}
		if (this.aiProvider === "ANTHROPIC") {
			return anthropicModels;
		}
		return [];
	}

	// ============================================================================
	// 유틸리티 메서드
	// ============================================================================

	/**
	 * 템플릿의 현재 상태 라벨을 반환합니다
	 */
	getStatusLabel(): string {
		switch (this.status) {
			case "DRAFT":
				return "초안";
			case "ACTIVE":
				return "활성화";
			case "INACTIVE":
				return "비활성화";
			case "ARCHIVED":
				return "보관됨";
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
}
