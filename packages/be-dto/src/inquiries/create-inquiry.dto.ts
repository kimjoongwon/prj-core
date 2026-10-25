import {
	StringField,
	StringFieldOptional,
	ULIDFieldOptional,
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

	@ULIDFieldOptional({
		description: "고객 ULID",
	})
	customerId?: string;

	@ULIDFieldOptional({
		description: "담당자 ULID",
	})
	assigneeId?: string;

	@StringFieldOptional({
		description: "문의 내용 (첫 메시지)",
	})
	content?: string;
}
