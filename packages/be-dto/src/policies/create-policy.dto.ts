import {
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

export class CreatePolicyDto {
	@StringField()
	name!: string;

	@StringFieldOptional()
	displayName?: string | null;

	@StringFieldOptional()
	description?: string | null;
}
