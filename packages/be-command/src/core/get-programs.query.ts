import type { GetProgramsQueryInput } from "@cocrepo/input";

export class GetProgramsQuery implements GetProgramsQueryInput {
	readonly skip?: GetProgramsQueryInput["skip"];
	readonly take?: GetProgramsQueryInput["take"];

	constructor(
		readonly sessionId: bigint,
		input: GetProgramsQueryInput,
	) {
		Object.assign(this, input);
	}
}
