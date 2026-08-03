import type { GetSessionsQueryInput } from "@cocrepo/input";

export class GetSessionsQuery implements GetSessionsQueryInput {
	readonly timelineId!: bigint;
	readonly search?: GetSessionsQueryInput["search"];
	readonly skip?: GetSessionsQueryInput["skip"];
	readonly take?: GetSessionsQueryInput["take"];
	readonly sort?: GetSessionsQueryInput["sort"];

	constructor(timelineId: bigint, input: GetSessionsQueryInput) {
		Object.assign(this, input);
		this.timelineId = timelineId;
	}
}
