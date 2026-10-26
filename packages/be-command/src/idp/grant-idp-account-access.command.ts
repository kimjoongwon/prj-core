import type { GrantIdpAccountAccessCommandInput } from "@cocrepo/input";
export class GrantIdpAccountAccessCommand
	implements GrantIdpAccountAccessCommandInput
{
	readonly spaceId!: GrantIdpAccountAccessCommandInput["spaceId"];
	readonly roleId!: GrantIdpAccountAccessCommandInput["roleId"];

	constructor(
		readonly userId: bigint,
		input: GrantIdpAccountAccessCommandInput,
	) {
		Object.assign(this, input);
	}
}
