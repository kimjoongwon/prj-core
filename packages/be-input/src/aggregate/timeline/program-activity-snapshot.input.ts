export interface ProgramActivitySnapshotInput {
	taskId: bigint;
	order: number;
	repetitions: number;
	restTime: number;
	notes?: string | null;
	exerciseName: string;
	exerciseDescription?: string | null;
	exerciseDuration: number;
	exerciseCount: number;
	imageFileId?: string | null;
	videoFileId?: string | null;
}
