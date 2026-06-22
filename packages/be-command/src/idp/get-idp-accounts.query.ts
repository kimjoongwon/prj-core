import type { GetIdpAccountsQueryInput } from "@cocrepo/input";

export class GetIdpAccountsQuery implements GetIdpAccountsQueryInput {
	readonly search?: string;
	readonly isActive?: boolean;
	readonly isLocked?: boolean;
	readonly sort?: string[];
	readonly skip?: number;
	readonly take?: number;

	constructor(input: GetIdpAccountsQueryInput) {
		Object.assign(this, input);
	}
}
