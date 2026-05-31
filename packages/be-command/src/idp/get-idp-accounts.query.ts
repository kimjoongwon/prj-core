import type { QueryIdpAccountDto } from "@cocrepo/dto";

export class GetIdpAccountsQuery {
	constructor(readonly query: QueryIdpAccountDto) {}
}
