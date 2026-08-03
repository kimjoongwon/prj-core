import { AbstractEntity } from "./abstract.entity";
import type { Program } from "./program.entity";

export class ProgramActivity extends AbstractEntity {
	/** 공개 식별자 ULID */
	programActivityId!: string;

	programId!: bigint;
	taskId!: bigint;
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
