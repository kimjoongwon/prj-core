import { IdpAccountAggregate } from "@cocrepo/aggregate";
import { GetIdpAccountQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetIdpAccountQuery)
export class GetIdpAccountByIdUseCase
	implements IQueryHandler<GetIdpAccountQuery>
{
	constructor(private readonly idpAccountService: IdpAccountAggregate) {}

	execute(query: GetIdpAccountQuery): Promise<unknown> {
		return this.idpAccountService.getById(query.userId);
	}
}
