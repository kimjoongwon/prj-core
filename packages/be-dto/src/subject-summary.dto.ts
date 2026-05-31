import {
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";

/**
 * Subject 간략 DTO (Ability 내 중첩용)
 */
export class SubjectSummaryDto {
	@UUIDField()
	id!: string;

	@StringField()
	name!: string;

	@StringFieldOptional()
	displayName!: string | null;

	@StringFieldOptional()
	group!: string | null;
}
