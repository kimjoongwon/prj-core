import type { GetOidcSessionsQueryInput } from "@cocrepo/input";

export class GetOidcSessionsQuery implements GetOidcSessionsQueryInput {
	readonly modelType?: GetOidcSessionsQueryInput["modelType"];
	readonly accountId?: GetOidcSessionsQueryInput["accountId"];
	readonly sort?: GetOidcSessionsQueryInput["sort"];
	readonly skip?: GetOidcSessionsQueryInput["skip"];
	readonly take?: GetOidcSessionsQueryInput["take"];

	constructor(input: GetOidcSessionsQueryInput) {
		Object.assign(this, input);
	}
}
