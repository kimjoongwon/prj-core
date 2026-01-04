import {
	EnumField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { type Subject, SubjectTypes } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";

export class SubjectDto extends AbstractDto implements Subject {
	@StringField()
	name: string;

	@EnumField(() => SubjectTypes)
	type: SubjectTypes;

	@StringFieldOptional()
	label: string | null;

	@StringFieldOptional()
	description: string | null;

	@UUIDFieldOptional()
	parentId: string | null;

	@UUIDField()
	tenantId: string;

	@NumberField()
	sortOrder: number;
}
