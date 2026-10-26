export interface UpdateProgramInput {
	name?: string;
	routineId?: bigint;
	instructorId?: bigint;
	capacity?: number;
	level?: string | null;
}
