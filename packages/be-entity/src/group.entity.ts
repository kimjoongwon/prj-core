import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	EnumField,
	StringField,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator/field";
import { GroupTypes } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Space } from "./space.entity";
import { User } from "./user.entity";

export class Group extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	@ULIDField()
	groupId!: string;

	@StringField()
	name!: string;
	@StringFieldOptional({ nullable: true })
	label!: string | null;
	@EnumField(() => GroupTypes, { required: true })
	type!: GroupTypes;
	@BigIntIdField()
	spaceId!: bigint;
	@BigIntIdFieldOptional({ nullable: true })
	createdById!: bigint | null;
	@ClassField(() => Space, { required: false })
	space?: Space;
	@ClassField(() => User, { required: false })
	createdBy?: User;
}
