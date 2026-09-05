import {
	BigIntIdField,
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { ProgramActivity } from "./program-activity.entity";
import { Routine } from "./routine.entity";
import { Session } from "./session.entity";

export class Program extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) programId!: string;

	@BigIntIdField() routineId!: bigint;
	@BigIntIdField() sessionId!: bigint;
	@BigIntIdField() instructorId!: bigint;
	@NumberField() capacity!: number;
	@StringField() name!: string;
	@StringFieldOptional({ nullable: true }) level!: string | null;
	@StringFieldOptional({ nullable: true }) routineNameSnapshot!: string | null;
	@StringFieldOptional({ nullable: true }) routineLabelSnapshot!: string | null;

	@ClassField(() => Routine) routine?: Routine;
	@ClassField(() => Session) session?: Session;
	@ClassField(() => ProgramActivity, { required: false, each: true })
	programActivities?: ProgramActivity[];
}
