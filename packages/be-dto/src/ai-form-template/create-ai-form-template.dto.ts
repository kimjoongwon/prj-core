import {
	BooleanFieldOptional,
	EnumField,
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { AIProvider } from "@cocrepo/prisma";

/**
 * AI 폼 템플릿 생성 DTO
 */
export class CreateAIFormTemplateDto {
	@StringField({
		minLength: 2,
		maxLength: 100,
		description: "템플릿 이름",
	})
	name: string;

	@StringFieldOptional({
		maxLength: 500,
		description: "템플릿 설명",
	})
	description?: string;

	@StringField({
		minLength: 2,
		maxLength: 50,
		description: "대상 도메인 (Member, Inquiry, Role 등)",
	})
	targetDomain: string;

	@StringField({
		minLength: 2,
		maxLength: 50,
		description: "대상 Entity 클래스명",
	})
	targetEntity: string;

	@EnumField(() => AIProvider, {
		description: "AI 제공자 (OPENAI, ANTHROPIC)",
	})
	aiProvider: AIProvider;

	@StringFieldOptional({
		maxLength: 50,
		description: "사용할 모델 (gpt-4, claude-3-opus 등)",
	})
	model?: string;

	@StringFieldOptional({
		description: "시스템 프롬프트",
	})
	systemPrompt?: string;

	@NumberFieldOptional({
		minimum: 0,
		description: "정렬 우선순위 (낮을수록 우선, 기본값: 0)",
	})
	priority?: number;

	@BooleanFieldOptional({
		description: "사용자 추가 프롬프트 허용 여부 (기본값: true)",
	})
	allowUserPrompt?: boolean;

	@NumberFieldOptional({
		minimum: 1,
		maximum: 100000,
		description: "최대 토큰 수",
	})
	maxTokens?: number;

	@NumberFieldOptional({
		minimum: 0,
		maximum: 1,
		description: "생성 온도 (0~1, 기본값: 0.7)",
	})
	temperature?: number;

	/**
	 * DTO → Prisma Create Input 변환
	 */
	toEntity(
		createdById: string,
		spaceId: string,
	): Prisma.AIFormTemplateUncheckedCreateInput {
		const entity: Prisma.AIFormTemplateUncheckedCreateInput = {
			name: this.name,
			targetDomain: this.targetDomain,
			targetEntity: this.targetEntity,
			aiProvider: this.aiProvider,
			priority: this.priority ?? 0,
			allowUserPrompt: this.allowUserPrompt ?? true,
			createdById,
			spaceId,
		};

		if (this.description) {
			entity.description = this.description;
		}
		if (this.model) {
			entity.model = this.model;
		}
		if (this.systemPrompt) {
			entity.systemPrompt = this.systemPrompt;
		}
		if (this.maxTokens !== undefined) {
			entity.maxTokens = this.maxTokens;
		}
		if (this.temperature !== undefined) {
			entity.temperature = this.temperature;
		}

		return entity;
	}
}

/**
 * AI 폼 필드 생성 DTO
 */
export class CreateAIFormFieldDto {
	@StringField({
		minLength: 1,
		maxLength: 100,
		description: "필드 이름",
	})
	fieldName: string;

	@StringField({
		description: "필드 라벨",
	})
	fieldLabel: string;

	@StringField({
		description: "AI 프롬프트",
	})
	prompt: string;

	@BooleanFieldOptional({
		description: "필수 필드 여부 (기본값: false)",
	})
	isRequired?: boolean;

	@NumberFieldOptional({
		minimum: 0,
		description: "정렬 순서",
	})
	order?: number;

	@StringFieldOptional({
		description: "기본값",
	})
	defaultValue?: string;

	@StringFieldOptional({
		description: "유효성 검증 정규식",
	})
	validationRegex?: string;

	@StringFieldOptional({
		description: "유효성 검증 실패 메시지",
	})
	validationMessage?: string;

	@NumberFieldOptional({
		minimum: 1,
		description: "최대 길이",
	})
	maxLength?: number;
}
