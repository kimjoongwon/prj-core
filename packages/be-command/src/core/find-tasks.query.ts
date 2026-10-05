import type { FindTasksQueryInput } from "@cocrepo/input";

export class FindTasksQuery implements FindTasksQueryInput {
	readonly spaceId!: FindTasksQueryInput["spaceId"];
	readonly spaceScope!: FindTasksQueryInput["spaceScope"];
	readonly skip?: FindTasksQueryInput["skip"];
	readonly take?: FindTasksQueryInput["take"];
	readonly search?: FindTasksQueryInput["search"];
	readonly contentLanguageCode?: FindTasksQueryInput["contentLanguageCode"];

	constructor(input: FindTasksQueryInput) {
		Object.assign(this, input);
	}
}
