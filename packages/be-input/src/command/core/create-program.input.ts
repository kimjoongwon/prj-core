export interface CreateProgramCommandInput {
	name: string;
	routineSeq: bigint;
	instructorSeq: bigint;
	capacity: number;
	level?: string | null;
}
