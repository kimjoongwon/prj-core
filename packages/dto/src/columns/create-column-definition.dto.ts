import {
	BooleanFieldOptional,
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";

/**
 * 컬럼 정의 생성 DTO
 * spaceId는 RequestContext에서 추출되므로 제외
 */
export class CreateColumnDefinitionDto {
	@StringField()
	entity: string;

	@StringField()
	field: string;

	@StringField()
	label: string;

	@NumberFieldOptional()
	sortOrder?: number;

	@BooleanFieldOptional()
	isRequired?: boolean;

	@BooleanFieldOptional()
	visibleOnDesktop?: boolean;

	@BooleanFieldOptional()
	visibleOnTablet?: boolean;

	@BooleanFieldOptional()
	visibleOnMobile?: boolean;

	@BooleanFieldOptional()
	sortable?: boolean;

	@StringFieldOptional()
	width?: string;

	@StringFieldOptional()
	minWidth?: string;

	@UUIDFieldOptional()
	subjectId?: string;
}
