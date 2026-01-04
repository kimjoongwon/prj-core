import type { Group as GroupEntity, GroupTypes } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Group extends AbstractEntity implements GroupEntity {
	name!: string;
	label!: string;
	type!: GroupTypes;
	spaceId!: string;
	creatorId!: string | null;
	space?: Space;
	creator?: User;
}
