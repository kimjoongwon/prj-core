import type { CreateTaskCommandInput } from "@cocrepo/input";
export class CreateTaskCommand implements CreateTaskCommandInput {
	readonly name!: CreateTaskCommandInput["name"];
	readonly description!: CreateTaskCommandInput["description"];
	readonly imageFileId!: CreateTaskCommandInput["imageFileId"];
	readonly duration!: CreateTaskCommandInput["duration"];
	readonly count!: CreateTaskCommandInput["count"];
	readonly videoFileId!: CreateTaskCommandInput["videoFileId"];

	constructor(
		input: CreateTaskCommandInput,
		readonly spaceId: bigint,
		readonly createdById: bigint,
	) {
		Object.assign(this, input);
	}
}
