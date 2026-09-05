import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Group } from "./group.entity";
import { User } from "./user.entity";

export class UserAssociation extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	userAssociationId!: string;

	@BigIntIdField()
	userId!: bigint;
	@BigIntIdField()
	groupId!: bigint;

	@ClassField(() => Group, { required: false, swagger: false })
	group?: Group;
	@ClassField(() => User, { required: false, swagger: false })
	user?: User;
}
