export interface CreateProgramCommandInput {
	name: string;
	routineId: bigint;
	instructorId: bigint;
	capacity: number;
	level: string;
}
