import { ClassField } from "@cocrepo/decorator/field";
import { Template } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";
import { CreateTemplateVariableItemDto } from "../create-template-variable-item.dto";

/**
 * 메시지 템플릿 생성 DTO
 *
 * - isActive는 서버에서 true로 기본 설정
 * - variables 배열로 변수를 함께 생성
 */
export class CreateTemplateDto extends PickType(Template, [
	"code",
	"name",
	"type",
	"subject",
	"content",
	"description",
] as const) {
	@ClassField(() => CreateTemplateVariableItemDto, {
		each: true,
		isArray: true,
		required: false,
		description: "템플릿 변수 목록",
	})
	variables?: CreateTemplateVariableItemDto[];
}
