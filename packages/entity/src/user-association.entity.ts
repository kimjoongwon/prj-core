import { UserAssociation as UserAssociationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Group } from "./group.entity";
import { User } from "./user.entity";

export class UserAssociation
	extends AbstractEntity
	implements UserAssociationEntity
{
	userId!: string;
	groupId!: string;

	group?: Group;
	user?: User;
}
