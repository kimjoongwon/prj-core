import type { CreateTimelineCommandInput } from "@cocrepo/input";
export class CreateTimelineCommand implements CreateTimelineCommandInput {
	readonly name!: CreateTimelineCommandInput["name"];
	readonly description!: CreateTimelineCommandInput["description"];

	constructor(input: CreateTimelineCommandInput) {
		Object.assign(this, input);
	}
}
