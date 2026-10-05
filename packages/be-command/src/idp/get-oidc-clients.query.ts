import type { GetOidcClientsQueryInput } from "@cocrepo/input";

export class GetOidcClientsQuery implements GetOidcClientsQueryInput {
	readonly search?: GetOidcClientsQueryInput["search"];
	readonly isActive?: GetOidcClientsQueryInput["isActive"];
	readonly sort?: GetOidcClientsQueryInput["sort"];
	readonly skip?: GetOidcClientsQueryInput["skip"];
	readonly take?: GetOidcClientsQueryInput["take"];

	constructor(input: GetOidcClientsQueryInput) {
		Object.assign(this, input);
	}
}
