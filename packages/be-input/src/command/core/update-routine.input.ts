import type { CreateRoutineActivityInput } from "./create-routine.input";

export interface UpdateRoutineCommandInput {
	activities?: CreateRoutineActivityInput[];
	name?: string;
	label?: string;
}
