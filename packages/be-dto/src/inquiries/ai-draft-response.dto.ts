import {
	BooleanField,
	NumberField,
	StringField,
	UUIDField,
} from "@cocrepo/decorator";
import { AbstractDto } from "../abstract.dto";

/**
 * AI 초안 응답 DTO
 */
export class AIDraftDto extends AbstractDto {
	@UUIDField({ description: "소속 문의 ID" })
	inquiryId!: string;

	@StringField({ description: "생성된 초안 내용" })
	draftContent!: string;

	@NumberField({ description: "신뢰도 점수 (0.0 ~ 1.0)" })
	confidence!: number;

	@StringField({ nullable: true, description: "사용된 AI 모델" })
	model!: string | null;

	@StringField({
		each: true,
		required: false,
		description: "참조된 지식베이스 문서 ID 목록",
	})
	referencedDocuments?: string[];
}

/**
 * 빠른 답변 옵션 DTO
 */
export class QuickReplyDto {
	@StringField({ description: "답변 ID" })
	id!: string;

	@StringField({ description: "답변 텍스트" })
	text!: string;

	@StringField({ nullable: true, description: "답변 설명" })
	description!: string | null;

	@NumberField({ description: "신뢰도 점수 (0.0 ~ 1.0)" })
	confidence!: number;
}

/**
 * 자동 해결 결과 DTO
 */
export class AutoResolveResultDto {
	@StringField({ description: "결과 상태 (success/partial/failed)" })
	status!: string;

	@StringField({ description: "생성된 응답 내용" })
	response!: string;

	@NumberField({ description: "신뢰도 점수 (0.0 ~ 1.0)" })
	confidence!: number;

	@BooleanField({ description: "자동 해결 적용 여부" })
	applied!: boolean;

	@StringField({ nullable: true, description: "실패 사유" })
	reason!: string | null;
}
