import {
	BigIntIdField,
	ClassField,
	NumberField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Routine } from "./routine.entity";
import { Task } from "./task.entity";

export class Activity extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) activityId!: string;

	@BigIntIdField() routineId!: bigint;
	@BigIntIdField() taskId!: bigint;
	@NumberField() order!: number;
	@NumberField() repetitions!: number;
	@NumberField() restTime!: number;
	@StringFieldOptional({ nullable: true }) notes!: string | null;

	@ClassField(() => Routine) routine?: Routine;
	@ClassField(() => Task) task?: Task;
}
