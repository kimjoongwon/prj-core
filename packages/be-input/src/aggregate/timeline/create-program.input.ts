export interface CreateProgramInput {
	name: string;
	routineSeq: bigint;
	instructorSeq: bigint;
	capacity: number;
	level?: string | null;
}
