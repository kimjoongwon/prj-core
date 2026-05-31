import type { Prisma } from "@cocrepo/prisma";

export class UpdateAbilityCommand {
	constructor(
		readonly abilityId: string,
		readonly data: Prisma.AbilityUncheckedUpdateInput,
	) {}
}
