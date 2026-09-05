import { StringFieldOptional } from "@cocrepo/decorator/field";
import { TemplateVariable } from "@cocrepo/entity";
import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";

/**
 * 템플릿 변수 생성 아이템 DTO
 */
export class CreateTemplateVariableItemDto extends IntersectionType(
	PickType(TemplateVariable, ["name"] as const),
	PartialType(PickType(TemplateVariable, ["isRequired"] as const), {
		skipNullProperties: false,
	}),
) {
	@StringFieldOptional({ description: "변수 설명" })
	description?: string;

	@StringFieldOptional({ description: "기본값" })
	defaultValue?: string;
}
