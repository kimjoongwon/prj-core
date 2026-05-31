import type { QueryOidcClientDto } from "@cocrepo/dto";

export class GetOidcClientsQuery {
	constructor(readonly query: QueryOidcClientDto) {}
}
