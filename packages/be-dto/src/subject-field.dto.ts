import {
	BooleanField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

/**
 * Subject 필드 정보 DTO (DMMF 기반)
 */
export class SubjectFieldDto {
	@StringField()
	name!: string;

	@StringFieldOptional()
	displayName!: string | null;

	@StringField()
	type!: string;

	@BooleanField()
	isRequired!: boolean;

	@BooleanField()
	isRelation!: boolean;
}
