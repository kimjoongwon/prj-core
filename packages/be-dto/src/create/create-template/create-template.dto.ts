import { ClassField } from "@cocrepo/decorator";
import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../../constant";
import { TemplateDto } from "../../template/template.dto";
import { CreateTemplateVariableItemDto } from "../create-template-variable-item.dto";

/**
 * 메시지 템플릿 생성 DTO
 *
 * - isActive는 서버에서 true로 기본 설정
 * - variables 배열로 변수를 함께 생성
 */
export class CreateTemplateDto extends OmitType(TemplateDto, [
	...COMMON_ENTITY_FIELDS,
	"isActive",
]) {
	@ClassField(() => CreateTemplateVariableItemDto, {
		each: true,
		required: false,
		description: "템플릿 변수 목록",
	})
	variables?: CreateTemplateVariableItemDto[];
}
