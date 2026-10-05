import type { GetTemplatesQueryInput } from "@cocrepo/input";

export class GetTemplatesQuery implements GetTemplatesQueryInput {
	readonly search?: GetTemplatesQueryInput["search"];
	readonly type?: GetTemplatesQueryInput["type"];
	readonly isActive?: GetTemplatesQueryInput["isActive"];
	readonly sort?: GetTemplatesQueryInput["sort"];
	readonly skip?: GetTemplatesQueryInput["skip"];
	readonly take?: GetTemplatesQueryInput["take"];

	constructor(input: GetTemplatesQueryInput) {
		Object.assign(this, input);
	}
}
