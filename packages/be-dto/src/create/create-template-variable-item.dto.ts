import {
	BooleanFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

/**
 * 템플릿 변수 생성 아이템 DTO
 */
export class CreateTemplateVariableItemDto {
	@StringField({ description: "변수명" })
	name!: string;

	@StringFieldOptional({ description: "변수 설명" })
	description?: string;

	@StringFieldOptional({ description: "기본값" })
	defaultValue?: string;

	@BooleanFieldOptional({ description: "필수 여부" })
	isRequired?: boolean;
}
