import { ClassField } from "@cocrepo/decorator/field";

import { Template } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";
import { CreateTemplateVariableItemDto } from "../create/create-template-variable-item.dto";

/**
 * 메시지 템플릿 수정 DTO
 *
 * - code, type은 수정 불가
 * - 나머지 필드는 모두 선택적
 */
export class UpdateTemplateDto extends PartialType(
	PickType(Template, ["name", "subject", "content", "description"] as const),
) {
	@ClassField(() => CreateTemplateVariableItemDto, {
		each: true,
		required: false,
		description: "템플릿 변수 목록",
	})
	variables?: CreateTemplateVariableItemDto[];
}
