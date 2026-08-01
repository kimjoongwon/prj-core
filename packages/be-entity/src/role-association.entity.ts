import type { RoleAssociation as RoleAssociationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Group } from "./group.entity";

export class RoleAssociation
	extends AbstractEntity
	implements DomainEntityModel<RoleAssociationEntity>
{
	roleId!: string;
	groupId!: string;

	group?: Group;
}
