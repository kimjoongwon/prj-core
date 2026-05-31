import type { Prisma } from "@cocrepo/prisma";

export class CreateAbilityCommand {
	constructor(readonly data: Prisma.AbilityUncheckedCreateInput) {}
}
