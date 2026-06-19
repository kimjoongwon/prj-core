import type { UpdatePolicyCommandInput } from "./update-policy.input";
export class UpdatePolicyCommand {
	constructor(
		readonly policyId: string,
		readonly input: UpdatePolicyCommandInput,
	) {}
}
