import type { UpdateAbilityCommandInput } from "@cocrepo/input";

export class UpdateAbilityCommand implements UpdateAbilityCommandInput {
	readonly actionSeq?: UpdateAbilityCommandInput["actionSeq"];
	readonly subjectSeq?: UpdateAbilityCommandInput["subjectSeq"];
	readonly fields?: UpdateAbilityCommandInput["fields"];
	readonly conditions?: UpdateAbilityCommandInput["conditions"];
	readonly inverted?: UpdateAbilityCommandInput["inverted"];
	readonly reason?: UpdateAbilityCommandInput["reason"];
	readonly name?: UpdateAbilityCommandInput["name"];
	readonly description?: UpdateAbilityCommandInput["description"];

	constructor(
		readonly abilitySeq: bigint,
		input: UpdateAbilityCommandInput,
	) {
		Object.assign(this, input);
	}
}
