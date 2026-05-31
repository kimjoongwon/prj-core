import { NumberField, StringField } from "@cocrepo/decorator";

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
