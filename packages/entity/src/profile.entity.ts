import { Profile as ProfileEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { User } from "./user.entity";

export class Profile extends AbstractEntity implements ProfileEntity {
	avatarFileId!: string;
	name!: string;
	nickname!: string;
	userId!: string;
	user?: User;
}
