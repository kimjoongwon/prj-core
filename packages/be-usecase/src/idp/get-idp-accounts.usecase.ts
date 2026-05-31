import { IdpAccountAggregateRoot } from "@cocrepo/aggregate";
import { GetIdpAccountsQuery } from "@cocrepo/command";
import { PageMetaDto } from "@cocrepo/dto";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetIdpAccountsQuery)
export class GetIdpAccountsUseCase
	implements IQueryHandler<GetIdpAccountsQuery>
{
	constructor(private readonly idpAccountService: IdpAccountAggregateRoot) {}

	async execute(query: GetIdpAccountsQuery): Promise<unknown> {
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 20;
		const idpAccountResult = await this.idpAccountService.getMany(query.query);
		return {
			data: idpAccountResult.data,
			meta: new PageMetaDto(skip, take, idpAccountResult.totalCount),
		};
	}
}
