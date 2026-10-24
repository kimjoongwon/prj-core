export interface CreateRoutineActivityInput {
	taskSeq: bigint;
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
