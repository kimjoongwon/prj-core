import {
	BigIntIdFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Inquiry } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * 문의 수정 DTO
 */
export class UpdateInquiryDto extends PartialType(
	PickType(Inquiry, [
		"category",
		"status",
		"priority",
		"isRealtimeChat",
	] as const),
	{ skipNullProperties: false },
) {
	@StringFieldOptional({
		minLength: 2,
		maxLength: 200,
		description: "문의 제목",
	})
	title?: string;

	@BigIntIdFieldOptional({
		description: "담당자 ID",
	})
	assigneeId?: bigint;
}
