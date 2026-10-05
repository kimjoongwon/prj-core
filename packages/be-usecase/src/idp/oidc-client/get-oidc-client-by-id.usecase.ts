import { OidcClientAggregate } from "@cocrepo/aggregate";
import { GetOidcClientQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetOidcClientQuery)
export class GetOidcClientByIdUseCase {
	constructor(private readonly oidcClientService: OidcClientAggregate) {}

	execute(query: GetOidcClientQuery): Promise<unknown> {
		return this.oidcClientService.getByOidcClientId(query.oidcClientId);
	}
}
