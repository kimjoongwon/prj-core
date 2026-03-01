import {
	BooleanFieldOptional,
	EnumFieldOptional,
	NumberFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator";
import { AIProvider } from "@cocrepo/prisma";

/**
 * AI 폼 템플릿 수정 DTO
 */
export class UpdateAIFormTemplateDto {
	@StringFieldOptional({
		minLength: 2,
		maxLength: 100,
		description: "템플릿 이름",
	})
	name?: string;

	@StringFieldOptional({
		maxLength: 500,
		description: "템플릿 설명",
	})
	description?: string;

	@StringFieldOptional({
		minLength: 2,
		maxLength: 50,
		description: "대상 도메인",
	})
	targetDomain?: string;

	@StringFieldOptional({
		minLength: 2,
		maxLength: 50,
		description: "대상 Entity 클래스명",
	})
	targetEntity?: string;

	@EnumFieldOptional(() => AIProvider, {
		description: "AI 제공자",
	})
	aiProvider?: AIProvider;

	@StringFieldOptional({
		maxLength: 50,
		description: "사용할 모델",
	})
	model?: string;

	@StringFieldOptional({
		description: "시스템 프롬프트",
	})
	systemPrompt?: string;

	@NumberFieldOptional({
		minimum: 0,
		description: "정렬 우선순위",
	})
	priority?: number;

	@BooleanFieldOptional({
		description: "사용자 추가 프롬프트 허용 여부",
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
		description: "생성 온도 (0~1)",
	})
	temperature?: number;
}

/**
 * AI 폼 필드 수정 DTO
 */
export class UpdateAIFormFieldDto {
	@StringFieldOptional({
		minLength: 1,
		maxLength: 100,
		description: "필드 이름",
	})
	fieldName?: string;

	@StringFieldOptional({
		description: "필드 라벨",
	})
	fieldLabel?: string;

	@StringFieldOptional({
		description: "AI 프롬프트",
	})
	prompt?: string;

	@BooleanFieldOptional({
		description: "필수 필드 여부",
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
