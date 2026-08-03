import { AbstractEntity } from "./abstract.entity";
import type { Group } from "./group.entity";

export class RoleAssociation extends AbstractEntity {
	/** 공개 식별자 ULID */
	roleAssociationId!: string;

	roleId!: bigint;
	groupId!: bigint;

	group?: Group;
}
