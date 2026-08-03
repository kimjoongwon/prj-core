import { AbstractEntity } from "./abstract.entity";
import type { ProgramActivity } from "./program-activity.entity";
import type { Routine } from "./routine.entity";
import type { Session } from "./session.entity";

export class Program extends AbstractEntity {
	/** 공개 식별자 ULID */
	programId!: string;

	routineId!: bigint;
	sessionId!: bigint;
	instructorId!: bigint;
	capacity!: number;
	name!: string;
	level!: string | null;
	routineNameSnapshot!: string | null;
	routineLabelSnapshot!: string | null;

	routine?: Routine;
	session?: Session;
	programActivities?: ProgramActivity[];
}
