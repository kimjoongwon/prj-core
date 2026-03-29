import type { ProgramActivity as ProgramActivityEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Program } from "./program.entity";

export class ProgramActivity
	extends AbstractEntity
	implements ProgramActivityEntity
{
	programId!: string;
	taskId!: string;
	order!: number;
	repetitions!: number;
	restTime!: number;
	notes!: string | null;
	exerciseName!: string;
	exerciseDescription!: string | null;
	exerciseDuration!: number;
	exerciseCount!: number;
	imageFileId!: string | null;
	videoFileId!: string | null;

	program?: Program;
}
