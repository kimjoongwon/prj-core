import {
	BooleanField,
	ClassField,
	DateField,
	EnumField,
	NumberField,
	StringField,
	UUIDField,
} from "@cocrepo/decorator";
import { AIProvider, ExecutionStatus } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * AI 폼 필드 결과 DTO
 */
export class AIFormFieldResultDto {
	@StringField({ description: "필드 이름" })
	fieldName!: string;

	@StringField({ description: "필드 라벨" })
	fieldLabel!: string;

	@StringField({ description: "AI가 생성한 값" })
	value!: string;

	@NumberField({ description: "신뢰도 점수 (0.0 ~ 1.0)" })
	confidence!: number;

	@StringField({ nullable: true, description: "값 설명/이유" })
	reason!: string | null;
}

/**
 * AI 폼 실행 응답 DTO
 */
export class AIFormExecuteResponseDto extends AbstractDto {
	@UUIDField({ description: "실행 ID" })
	id!: string;

	@UUIDField({ description: "템플릿 ID" })
	templateId!: string;

	@EnumField(() => ExecutionStatus, { description: "실행 상태" })
	status!: ExecutionStatus;

	@EnumField(() => AIProvider, { description: "사용된 AI 제공자" })
	aiProvider!: AIProvider;

	@StringField({ description: "사용된 모델" })
	model!: string;

	@ClassField(() => AIFormFieldResultDto, {
		isArray: true,
		description: "필드별 AI 생성 결과",
	})
	results!: AIFormFieldResultDto[];

	@BooleanField({ description: "결과 적용 여부" })
	isApplied!: boolean;

	@DateField({ nullable: true, description: "결과 적용 일시" })
	appliedAt!: Date | null;

	@UUIDField({ nullable: true, description: "적용된 대상 Entity ID" })
	targetEntityId!: string | null;

	@NumberField({ nullable: true, description: "사용된 토큰 수" })
	tokensUsed!: number | null;

	@NumberField({ nullable: true, description: "실행 시간 (ms)" })
	executionTimeMs!: number | null;

	@StringField({ nullable: true, description: "에러 메시지" })
	errorMessage!: string | null;

	@DateField({ description: "실행 일시" })
	createdAt!: Date;
}

/**
 * AI 폼 프리뷰 응답 DTO
 */
export class AIFormPreviewResponseDto {
	@ClassField(() => AIFormFieldResultDto, {
		isArray: true,
		description: "필드별 AI 생성 결과 (프리뷰)",
	})
	results!: AIFormFieldResultDto[];

	@StringField({ description: "사용된 모델" })
	model!: string;

	@NumberField({ nullable: true, description: "예상 토큰 수" })
	estimatedTokens!: number | null;

	@NumberField({ description: "신뢰도 점수 (0.0 ~ 1.0)" })
	confidence!: number;

	@StringField({ nullable: true, description: "조언/제안 사항" })
	suggestions!: string | null;
}
