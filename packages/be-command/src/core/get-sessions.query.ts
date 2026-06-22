import type { GetSessionsQueryInput } from "@cocrepo/input";

export class GetSessionsQuery implements GetSessionsQueryInput {
	readonly timelineId!: string;
	readonly search?: GetSessionsQueryInput["search"];
	readonly skip?: GetSessionsQueryInput["skip"];
	readonly take?: GetSessionsQueryInput["take"];
	readonly sort?: GetSessionsQueryInput["sort"];

	constructor(
		timelineId: string,
		input: GetSessionsQueryInput,
	) {
		Object.assign(this, input);
		this.timelineId = timelineId;
	}
}
