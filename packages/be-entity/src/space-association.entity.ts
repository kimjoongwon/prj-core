import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Group } from "./group.entity";

export class SpaceAssociation extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	spaceAssociationId!: string;

	@BigIntIdField()
	spaceId!: bigint;
	@BigIntIdField()
	groupId!: bigint;

	@ClassField(() => Group, { required: false, swagger: false })
	group?: Group;
}
