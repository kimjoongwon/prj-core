import { Group as GroupEntity, GroupTypes } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Tenant } from "./tenant.entity";

export class Group extends AbstractEntity implements GroupEntity {
	name!: string;
	label!: string;
	type!: GroupTypes;
	tenantId!: string;
	tenant?: Tenant;
}
