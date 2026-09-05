import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	StringField,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Activity } from "./activity.entity";
import { Program } from "./program.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";

export class Routine extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) routineId!: string;

	@StringField() name!: string;
	@StringField() label!: string;
	@BigIntIdField() spaceId!: bigint;
	@BigIntIdFieldOptional({ nullable: true }) createdById!: bigint | null;

	space?: Space;
	@ClassField(() => User, { required: false, nullable: true })
	createdBy?: User | null;
	@ClassField(() => Program, { isArray: true })
	programs?: Program[];
	@ClassField(() => Activity, { isArray: true })
	activities?: Activity[];
}
