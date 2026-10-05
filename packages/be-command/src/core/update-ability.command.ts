import type { UpdateAbilityCommandInput } from "@cocrepo/input";

export class UpdateAbilityCommand implements UpdateAbilityCommandInput {
	readonly actionId?: UpdateAbilityCommandInput["actionId"];
	readonly subjectId?: UpdateAbilityCommandInput["subjectId"];
	readonly fields?: UpdateAbilityCommandInput["fields"];
	readonly conditions?: UpdateAbilityCommandInput["conditions"];
	readonly inverted?: UpdateAbilityCommandInput["inverted"];
	readonly reason?: UpdateAbilityCommandInput["reason"];
	readonly name?: UpdateAbilityCommandInput["name"];
	readonly description?: UpdateAbilityCommandInput["description"];

	constructor(
		readonly abilityId: bigint,
		input: UpdateAbilityCommandInput,
	) {
		Object.assign(this, input);
	}
}
