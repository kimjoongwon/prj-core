import { RoleAssociation as RoleAssociationEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { Group } from "./group.entity";

export class RoleAssociation extends AbstractEntity implements RoleAssociationEntity {
	roleId!: string;
	groupId!: string;

	group?: Group;
}
