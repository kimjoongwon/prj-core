import { AbstractEntity } from "./abstract.entity";
import type { Group } from "./group.entity";

export class SpaceAssociation extends AbstractEntity {
	/** 공개 식별자 ULID */
	spaceAssociationId!: string;

	spaceId!: bigint;
	groupId!: bigint;

	group?: Group;
}
