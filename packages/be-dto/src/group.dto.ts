import {
	EnumField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { Group } from "@cocrepo/prisma";
import { GroupTypes } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";

export class GroupDto extends AbstractDto implements Group {
	@UUIDField()
	spaceId!: string;

	@StringField()
	name!: string;

	@StringFieldOptional({ nullable: true })
	label!: string | null;

	@EnumField(() => GroupTypes, { required: true })
	type!: GroupTypes;

	@UUIDFieldOptional({ nullable: true })
	createdById!: string | null;
}
