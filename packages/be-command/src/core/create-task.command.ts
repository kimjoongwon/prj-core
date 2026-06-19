import type { CreateTaskCommandInput } from "./create-task.input";
export class CreateTaskCommand {
	constructor(
		readonly input: CreateTaskCommandInput,
		readonly spaceId: string,
		readonly creatorId: string,
	) {}
}
