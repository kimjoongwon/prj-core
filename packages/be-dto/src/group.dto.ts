import {
	EnumField,
	StringField,
	StringFieldOptional,
	ULIDField,
	ULIDFieldOptional,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Group } from "@cocrepo/prisma";
import { GroupTypes } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";

export class GroupDto extends AbstractDto implements DomainEntityModel<Group> {
	@ULIDField()
	spaceId!: string;

	@StringField()
	name!: string;

	@StringFieldOptional({ nullable: true })
	label!: string | null;

	@EnumField(() => GroupTypes, { required: true })
	type!: GroupTypes;

	@ULIDFieldOptional({ nullable: true })
	createdById!: string | null;
}
