import type { CreateAbilityCommandInput } from "./create-ability.input";

export class CreateAbilityCommand {
	constructor(readonly input: CreateAbilityCommandInput) {}
}
