import type { GrantIdpAccountAccessDto } from "@cocrepo/dto";

export class GrantIdpAccountAccessCommand {
	constructor(
		readonly userId: string,
		readonly dto: GrantIdpAccountAccessDto,
	) {}
}
