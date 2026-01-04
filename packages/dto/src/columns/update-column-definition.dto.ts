import {
	BooleanFieldOptional,
	NumberFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";

export class UpdateColumnDefinitionDto {
	@StringFieldOptional()
	label?: string;

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
