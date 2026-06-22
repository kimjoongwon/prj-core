export interface CreateRoutineActivityInput {
	taskId: string;
	order?: number;
	repetitions?: number;
	restTime?: number;
	notes?: string;
}

export interface CreateRoutineCommandInput {
	activities?: CreateRoutineActivityInput[];
	name: string;
	label: string;
}
