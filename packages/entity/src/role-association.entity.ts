import type { RoleAssociation as RoleAssociationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Group } from "./group.entity";

export class RoleAssociation
	extends AbstractEntity
	implements RoleAssociationEntity
{
	roleId!: string;
	groupId!: string;

	group?: Group;
}
