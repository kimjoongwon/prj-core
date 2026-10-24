import type { GrantIdpAccountAccessCommandInput } from "@cocrepo/input";
export class GrantIdpAccountAccessCommand
	implements GrantIdpAccountAccessCommandInput
{
	readonly spaceSeq!: GrantIdpAccountAccessCommandInput["spaceSeq"];
	readonly roleSeq!: GrantIdpAccountAccessCommandInput["roleSeq"];

	constructor(
		readonly userSeq: bigint,
		input: GrantIdpAccountAccessCommandInput,
	) {
		Object.assign(this, input);
	}
}
