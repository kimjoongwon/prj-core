import type { Activity as ActivityEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Routine } from "./routine.entity";
import type { Task } from "./task.entity";

export class Activity
	extends AbstractEntity
	implements DomainEntityModel<ActivityEntity>
{
	routineId!: string;
	taskId!: string;
	order!: number;
	repetitions!: number;
	restTime!: number;
	notes!: string | null;

	routine?: Routine;
	task?: Task;
}
