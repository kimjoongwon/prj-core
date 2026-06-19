import type { UpdateAbilityCommandInput } from "./update-ability.input";

export class UpdateAbilityCommand {
	constructor(
		readonly abilityId: string,
		readonly input: UpdateAbilityCommandInput,
	) {}
}
