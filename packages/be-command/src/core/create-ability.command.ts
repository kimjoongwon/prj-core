import type { CreateAbilityCommandInput } from "@cocrepo/input";

export class CreateAbilityCommand implements CreateAbilityCommandInput {
	readonly actionSeq!: CreateAbilityCommandInput["actionSeq"];
	readonly subjectSeq!: CreateAbilityCommandInput["subjectSeq"];
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
