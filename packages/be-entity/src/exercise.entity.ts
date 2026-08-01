import type { Exercise as ExerciseEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Task } from "./task.entity";

export class Exercise
	extends AbstractEntity
	implements DomainEntityModel<ExerciseEntity>
{
	duration!: number;
	count!: number;
	taskId!: string;
	description!: string | null;
	imageFileId!: string | null;
	videoFileId!: string | null;
	name!: string;

	task?: Task;
}
