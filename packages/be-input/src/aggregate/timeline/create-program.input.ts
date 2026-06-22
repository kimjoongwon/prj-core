export interface CreateProgramInput {
	name: string;
	routineId: string;
	instructorId: string;
	capacity: number;
	level?: string | null;
}
