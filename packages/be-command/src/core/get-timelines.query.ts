import type { GetTimelinesQueryInput } from "@cocrepo/input";

export class GetTimelinesQuery implements GetTimelinesQueryInput {
	readonly timelineId?: GetTimelinesQueryInput["timelineId"];
	readonly search?: GetTimelinesQueryInput["search"];
	readonly contentLanguageCode?: GetTimelinesQueryInput["contentLanguageCode"];
	readonly sort?: GetTimelinesQueryInput["sort"];
	readonly skip?: GetTimelinesQueryInput["skip"];
	readonly take?: GetTimelinesQueryInput["take"];

	constructor(input: GetTimelinesQueryInput) {
		Object.assign(this, input);
	}
}
