import type { GrantIdpAccountAccessCommandInput } from "./grant-idp-account-access.input";
export class GrantIdpAccountAccessCommand {
	constructor(
		readonly userId: string,
		readonly input: GrantIdpAccountAccessCommandInput,
	) {}
}
