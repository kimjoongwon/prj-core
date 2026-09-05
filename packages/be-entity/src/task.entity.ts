import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Activity } from "./activity.entity";
import { Exercise } from "./exercise.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Task extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) taskId!: string;

	@BigIntIdField() spaceId!: bigint;
	@BigIntIdFieldOptional({ nullable: true }) createdById!: bigint | null;

	space?: Space;
	createdBy?: User;
	@ClassField(() => Exercise) exercise?: Exercise;
	@ClassField(() => Activity, { isArray: true }) activities?: Activity[];
}
