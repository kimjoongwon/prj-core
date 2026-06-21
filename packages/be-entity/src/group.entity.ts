import type { Group as GroupEntity, GroupTypes } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Tenant } from "./tenant.entity";
import type { User } from "./user.entity";

export class Group extends AbstractEntity implements GroupEntity {
	name!: string;
	label!: string | null;
	type!: GroupTypes;
	tenantId!: string;
	creatorId!: string | null;
	tenant?: Tenant;
	creator?: User;
}
