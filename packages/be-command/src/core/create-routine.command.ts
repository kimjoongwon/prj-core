import type { CreateRoutineCommandInput } from "@cocrepo/input";
export class CreateRoutineCommand implements CreateRoutineCommandInput {
	readonly activities?: CreateRoutineCommandInput["activities"];
	readonly name!: CreateRoutineCommandInput["name"];
	readonly label!: CreateRoutineCommandInput["label"];

	constructor(input: CreateRoutineCommandInput) {
		Object.assign(this, input);
	}
}
