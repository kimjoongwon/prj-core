import { Exercise as ExerciseEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { Task } from "./task.entity";

export class Exercise extends AbstractEntity implements ExerciseEntity {
	duration!: number;
	count!: number;
	taskId!: string;
	description!: string | null;
	imageFileId!: string | null;
	videoFileId!: string | null;
	name!: string;

	task?: Task;
}
