import { AbstractEntity } from "./abstract.entity";
import type { User } from "./user.entity";

export class Profile extends AbstractEntity {
	/** 공개 식별자 ULID */
	profileId!: string;

	avatarFileId!: string | null;
	name!: string;
	nickname!: string;
	address!: string;
	userId!: bigint;
	user?: User;
}
