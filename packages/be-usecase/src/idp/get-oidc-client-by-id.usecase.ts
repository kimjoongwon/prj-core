import { OidcClientAggregate } from "@cocrepo/aggregate";
import { GetOidcClientQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetOidcClientQuery)
export class GetOidcClientByIdUseCase
	implements IQueryHandler<GetOidcClientQuery>
{
	constructor(private readonly oidcClientService: OidcClientAggregate) {}

	execute(query: GetOidcClientQuery): Promise<unknown> {
		return this.oidcClientService.getById(query.oidcClientId);
	}
}
