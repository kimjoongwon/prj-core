import { NumberField, StringField, UUIDField } from "@cocrepo/decorator";
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
