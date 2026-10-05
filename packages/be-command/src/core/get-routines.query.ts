import type { GetRoutinesQueryInput } from "@cocrepo/input";

export class GetRoutinesQuery implements GetRoutinesQueryInput {
	readonly search?: GetRoutinesQueryInput["search"];
	readonly spaceScope?: GetRoutinesQueryInput["spaceScope"];
	readonly contentLanguageCode?: GetRoutinesQueryInput["contentLanguageCode"];
	readonly skip?: GetRoutinesQueryInput["skip"];
	readonly take?: GetRoutinesQueryInput["take"];

	constructor(input: GetRoutinesQueryInput) {
		Object.assign(this, input);
	}
}
