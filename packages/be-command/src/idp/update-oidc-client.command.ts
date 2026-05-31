import type { UpdateOidcClientDto } from "@cocrepo/dto";

export class UpdateOidcClientCommand {
	constructor(
		readonly oidcClientId: string,
		readonly dto: UpdateOidcClientDto,
	) {}
}
