import type { CreateOidcClientDto } from "@cocrepo/dto";

export class CreateOidcClientCommand {
	constructor(readonly dto: CreateOidcClientDto) {}
}
