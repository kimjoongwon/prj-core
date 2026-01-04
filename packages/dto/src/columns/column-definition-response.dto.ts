import {
	BooleanField,
	DateField,
	DateFieldOptional,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { Expose } from "class-transformer";

export class ColumnDefinitionResponseDto {
	@Expose()
	@UUIDField()
	id: string;

	@Expose()
	@StringField()
	entity: string;

	@Expose()
	@StringField()
	field: string;

	@Expose()
	@StringField()
	label: string;

	@Expose()
	@NumberField()
	sortOrder: number;

	@Expose()
	@BooleanField()
	isRequired: boolean;

	@Expose()
	@BooleanField()
	visibleOnDesktop: boolean;

	@Expose()
	@BooleanField()
	visibleOnTablet: boolean;

	@Expose()
	@BooleanField()
	visibleOnMobile: boolean;

	@Expose()
	@BooleanField()
	sortable: boolean;

	@Expose()
	@StringFieldOptional()
	width?: string | null;

	@Expose()
	@StringFieldOptional()
	minWidth?: string | null;

	@Expose()
	@UUIDField()
	spaceId: string;

	@Expose()
	@UUIDFieldOptional()
	subjectId?: string | null;

	@Expose()
	@DateField()
	createdAt: Date;

	@Expose()
	@DateFieldOptional()
	updatedAt?: Date | null;
}
