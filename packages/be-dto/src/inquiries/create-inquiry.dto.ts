import {
	BigIntIdFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Inquiry } from "@cocrepo/entity";
import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";

/**
 * 문의 생성 DTO
 */
export class CreateInquiryDto extends IntersectionType(
	PickType(Inquiry, ["category", "channel"] as const),
	PartialType(PickType(Inquiry, ["source", "priority"] as const), {
		skipNullProperties: false,
	}),
) {
	@StringField({
		minLength: 2,
		maxLength: 200,
		description: "문의 제목",
	})
	title: string;

	@BigIntIdFieldOptional({
		description: "고객 ID",
	})
	customerId?: bigint;

	@BigIntIdFieldOptional({
		description: "담당자 ID",
	})
	assigneeId?: bigint;

	@StringFieldOptional({
		description: "문의 내용 (첫 메시지)",
	})
	content?: string;
}
