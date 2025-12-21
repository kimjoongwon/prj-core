import { Activity as ActivityEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Routine } from "./routine.entity";
import { Task } from "./task.entity";

export class Activity extends AbstractEntity implements ActivityEntity {
	routineId!: string;
	taskId!: string;
	order!: number;
	repetitions!: number;
	restTime!: number;
	notes!: string | null;

	routine?: Routine;
	task?: Task;
}
