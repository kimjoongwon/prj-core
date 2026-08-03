import { AbstractEntity } from "./abstract.entity";
import type { Routine } from "./routine.entity";
import type { Task } from "./task.entity";

export class Activity extends AbstractEntity {
	/** 공개 식별자 ULID */
	activityId!: string;

	routineId!: bigint;
	taskId!: bigint;
	order!: number;
	repetitions!: number;
	restTime!: number;
	notes!: string | null;

	routine?: Routine;
	task?: Task;
}
