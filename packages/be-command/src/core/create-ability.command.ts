import type { CreateAbilityCommandInput } from "@cocrepo/input";

export class CreateAbilityCommand implements CreateAbilityCommandInput {
	readonly actionId!: CreateAbilityCommandInput["actionId"];
	readonly subjectId!: CreateAbilityCommandInput["subjectId"];
	readonly fields?: CreateAbilityCommandInput["fields"];
	readonly conditions?: CreateAbilityCommandInput["conditions"];
	readonly inverted?: CreateAbilityCommandInput["inverted"];
	readonly reason?: CreateAbilityCommandInput["reason"];
	readonly name!: CreateAbilityCommandInput["name"];
	readonly description?: CreateAbilityCommandInput["description"];

	constructor(input: CreateAbilityCommandInput) {
		Object.assign(this, input);
	}
}
