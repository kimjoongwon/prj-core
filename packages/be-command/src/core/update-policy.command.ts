import type { UpdatePolicyCommandInput } from "@cocrepo/input";
export class UpdatePolicyCommand implements UpdatePolicyCommandInput {
	readonly name?: UpdatePolicyCommandInput["name"];
	readonly displayName?: UpdatePolicyCommandInput["displayName"];
	readonly description?: UpdatePolicyCommandInput["description"];

	constructor(
		readonly policySeq: bigint,
		input: UpdatePolicyCommandInput,
	) {
		Object.assign(this, input);
	}
}
