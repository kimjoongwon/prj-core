import type { UserAssociation as UserAssociationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Group } from "./group.entity";
import type { User } from "./user.entity";

export class UserAssociation
	extends AbstractEntity
	implements UserAssociationEntity
{
	userId!: string;
	groupId!: string;

	group?: Group;
	user?: User;
}
