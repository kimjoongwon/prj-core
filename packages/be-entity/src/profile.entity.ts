import type { Profile as ProfileEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { User } from "./user.entity";

export class Profile
	extends AbstractEntity
	implements DomainEntityModel<ProfileEntity>
{
	avatarFileId!: string;
	name!: string;
	nickname!: string;
	address!: string;
	userId!: string;
	user?: User;
}
