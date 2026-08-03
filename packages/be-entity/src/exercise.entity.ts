import { AbstractEntity } from "./abstract.entity";
import type { Task } from "./task.entity";

export class Exercise extends AbstractEntity {
	/** 공개 식별자 ULID */
	exerciseId!: string;

	duration!: number;
	count!: number;
	taskId!: bigint;
	description!: string | null;
	imageFileId!: string | null;
	videoFileId!: string | null;
	name!: string;

	task?: Task;
}
