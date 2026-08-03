import { AbstractEntity } from "./abstract.entity";
import type { Group } from "./group.entity";
import type { User } from "./user.entity";

export class UserAssociation extends AbstractEntity {
	/** 공개 식별자 ULID */
	userAssociationId!: string;

	userId!: bigint;
	groupId!: bigint;

	group?: Group;
	user?: User;
}
