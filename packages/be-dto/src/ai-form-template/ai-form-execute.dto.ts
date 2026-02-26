import {
	BooleanFieldOptional,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";

/**
 * AI 폼 실행 요청 DTO
 */
export class AIFormExecuteDto {
	@UUIDField({
		description: "AI 폼 템플릿 ID",
	})
	templateId: string;

	@StringFieldOptional({
		description: "컨텍스트 데이터 (JSON 문자열 또는 객체)",
	})
	context?: string;

	@StringFieldOptional({
		description: "사용자 추가 프롬프트",
	})
	userPrompt?: string;

	@BooleanFieldOptional({
		description: "결과 자동 적용 여부 (기본값: false)",
	})
	autoApply?: boolean;

	@UUIDFieldOptional({
		description: "적용할 대상 Entity ID (autoApply=true인 경우 필수)",
	})
	targetEntityId?: string;
}

/**
 * AI 폼 프리뷰 요청 DTO
 */
export class AIFormPreviewDto {
	@UUIDField({
		description: "AI 폼 템플릿 ID",
	})
	templateId: string;

	@StringFieldOptional({
		description: "컨텍스트 데이터 (JSON 문자열 또는 객체)",
	})
	context?: string;

	@StringFieldOptional({
		description: "사용자 추가 프롬프트",
	})
	userPrompt?: string;
}
