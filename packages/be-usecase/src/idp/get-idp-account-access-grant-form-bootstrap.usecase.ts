import { IdpAccountAggregate } from "@cocrepo/aggregate";
import { GetIdpAccountAccessGrantFormQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetIdpAccountAccessGrantFormQuery)
export class GetIdpAccountAccessGrantFormBootstrapUseCase
	implements IQueryHandler<GetIdpAccountAccessGrantFormQuery>
{
	constructor(private readonly idpAccountService: IdpAccountAggregate) {}

	execute(query: GetIdpAccountAccessGrantFormQuery): Promise<unknown> {
		return this.idpAccountService.getAccessGrantFormBootstrap(query.userId);
	}
}
