import type { GroupTypes } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Group extends AbstractEntity {
	/** 공개 식별자 ULID */
	groupId!: string;

	name!: string;
	label!: string | null;
	type!: GroupTypes;
	spaceId!: bigint;
	createdById!: bigint | null;
	space?: Space;
	createdBy?: User;
}
