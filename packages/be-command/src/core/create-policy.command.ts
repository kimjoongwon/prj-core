import type { CreatePolicyCommandInput } from "@cocrepo/input";
export class CreatePolicyCommand implements CreatePolicyCommandInput {
	readonly name!: CreatePolicyCommandInput["name"];
	readonly displayName?: CreatePolicyCommandInput["displayName"];
	readonly description?: CreatePolicyCommandInput["description"];
	readonly isSystem?: CreatePolicyCommandInput["isSystem"];

	constructor(input: CreatePolicyCommandInput) {
		Object.assign(this, input);
	}
}
