import type { Group as GroupEntity, GroupTypes } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Group
	extends AbstractEntity
	implements DomainEntityModel<GroupEntity>
{
	name!: string;
	label!: string | null;
	type!: GroupTypes;
	spaceId!: string;
	createdById!: string | null;
	space?: Space;
	createdBy?: User;
}
