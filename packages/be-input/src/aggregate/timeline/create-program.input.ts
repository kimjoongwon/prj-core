export interface CreateProgramInput {
	name: string;
	routineId: bigint;
	instructorId: bigint;
	capacity: number;
	level?: string | null;
}
