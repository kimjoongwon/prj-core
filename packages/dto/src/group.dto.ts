import {
	ClassField,
	EnumField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { Group } from "@cocrepo/prisma";
import { GroupTypes } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { SpaceDto } from "./space.dto";

export class GroupDto extends AbstractDto implements Group {
	@StringField()
	name!: string;

	@StringFieldOptional({ nullable: true })
	label!: string | null;

	@EnumField(() => GroupTypes, { required: true })
	type!: GroupTypes;

	@UUIDField()
	spaceId!: string;

	@UUIDFieldOptional()
	creatorId!: string | null;

	@ClassField(() => SpaceDto, { required: false })
	space?: SpaceDto;
}
