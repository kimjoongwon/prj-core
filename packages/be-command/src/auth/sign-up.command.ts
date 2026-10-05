import type { SignUpCommandInput } from "@cocrepo/input";
export class SignUpCommand implements SignUpCommandInput {
	readonly nickname!: SignUpCommandInput["nickname"];
	readonly spaceId!: SignUpCommandInput["spaceId"];
	readonly email!: SignUpCommandInput["email"];
	readonly name!: SignUpCommandInput["name"];
	readonly phone!: SignUpCommandInput["phone"];
	readonly address!: SignUpCommandInput["address"];
	readonly password!: SignUpCommandInput["password"];

	constructor(input: SignUpCommandInput) {
		Object.assign(this, input);
	}
}
