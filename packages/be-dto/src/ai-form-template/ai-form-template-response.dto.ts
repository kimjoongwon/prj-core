import {
	BooleanField,
	ClassField,
	DateField,
	EnumField,
	NumberField,
	StringField,
	UUIDField,
} from "@cocrepo/decorator";
import type { AIFormTemplate } from "@cocrepo/prisma";
import { AIProvider, AITemplateStatus } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * AI 폼 필드 응답 DTO
 */
export class AIFormFieldDto extends AbstractDto {
	@UUIDField({ description: "필드 ID" })
	id!: string;

	@UUIDField({ description: "소속 템플릿 ID" })
	templateId!: string;

	@StringField({ description: "필드 이름" })
	fieldName!: string;

	@StringField({ nullable: true, description: "필드 라벨" })
	fieldLabel!: string | null;

	@StringField({ description: "AI 프롬프트" })
	prompt!: string;

	@BooleanField({ description: "필수 필드 여부" })
	isRequired!: boolean;

	@NumberField({ description: "정렬 순서" })
	order!: number;

	@StringField({ nullable: true, description: "기본값" })
	defaultValue!: string | null;

	@StringField({ nullable: true, description: "유효성 검증 정규식" })
	validationRegex!: string | null;

	@StringField({ nullable: true, description: "유효성 검증 실패 메시지" })
	validationMessage!: string | null;

	@NumberField({ nullable: true, description: "최대 길이" })
	maxLength!: number | null;
}

/**
 * AI 폼 템플릿 응답 DTO
 */
export class AIFormTemplateDto
	extends AbstractDto
	implements Partial<AIFormTemplate>
{
	@StringField({ description: "템플릿 이름" })
	name!: string;

	@StringField({ nullable: true, description: "템플릿 설명" })
	description!: string | null;

	@StringField({ description: "대상 도메인" })
	targetDomain!: string;

	@StringField({ description: "대상 Entity 클래스명" })
	targetEntity!: string;

	@EnumField(() => AIProvider, { description: "AI 제공자" })
	aiProvider!: AIProvider;

	@StringField({ nullable: true, description: "사용할 모델" })
	model!: string | null;

	@StringField({ nullable: true, description: "시스템 프롬프트" })
	systemPrompt!: string | null;

	@EnumField(() => AITemplateStatus, { description: "템플릿 상태" })
	status!: AITemplateStatus;

	@NumberField({ description: "정렬 우선순위" })
	priority!: number;

	@BooleanField({ description: "사용자 추가 프롬프트 허용 여부" })
	allowUserPrompt!: boolean;

	@NumberField({ nullable: true, description: "최대 토큰 수" })
	maxTokens!: number | null;

	@NumberField({ nullable: true, description: "생성 온도" })
	temperature!: number | null;

	@DateField({ description: "생성 일시" })
	createdAt!: Date;

	@DateField({ description: "수정 일시" })
	updatedAt!: Date;

	@UUIDField({ description: "생성자 ID" })
	createdById!: string;

	@ClassField(() => AIFormFieldDto, {
		isArray: true,
		required: false,
		description: "폼 필드 목록",
	})
	fields?: AIFormFieldDto[];
}

/**
 * AI 폼 템플릿 페이지네이션 메타 정보
 */
export class AIFormTemplatePaginationMetaDto {
	@NumberField({ description: "전체 개수" })
	total!: number;

	@NumberField({ description: "건너뛴 항목 수 (offset)" })
	skip!: number;

	@NumberField({ description: "조회 항목 수" })
	take!: number;

	@NumberField({ description: "전체 페이지 수" })
	totalPages!: number;
}

/**
 * AI 폼 템플릿 통계 DTO
 */
export class AIFormTemplateStatsDto {
	@NumberField({ description: "전체 템플릿 수" })
	total!: number;

	@NumberField({ description: "활성 템플릿 수" })
	active!: number;

	@NumberField({ description: "비활성 템플릿 수" })
	inactive!: number;

	@NumberField({ description: "초안 템플릿 수" })
	draft!: number;

	@NumberField({ description: "보관된 템플릿 수" })
	archived!: number;
}
