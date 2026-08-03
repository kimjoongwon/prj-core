import {
	BigIntIdField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

/**
 * Subject 간략 DTO (Ability 내 중첩용)
 */
export class SubjectSummaryDto {
	@BigIntIdField()
	id!: bigint;

	@StringField()
	name!: string;

	@StringFieldOptional()
	displayName!: string | null;

	@StringFieldOptional()
	group!: string | null;
}
