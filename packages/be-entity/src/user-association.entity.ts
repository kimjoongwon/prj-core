import type { UserAssociation as UserAssociationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Group } from "./group.entity";
import type { User } from "./user.entity";

export class UserAssociation
	extends AbstractEntity
	implements DomainEntityModel<UserAssociationEntity>
{
	userId!: string;
	groupId!: string;

	group?: Group;
	user?: User;
}
