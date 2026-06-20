import { IdpAccountAggregate } from "@cocrepo/aggregate";
import { GetIdpAccountsQuery } from "@cocrepo/command";
import { buildOffsetPageMeta } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetIdpAccountsQuery)
export class GetIdpAccountsUseCase {
	constructor(private readonly idpAccountService: IdpAccountAggregate) {}

	async execute(query: GetIdpAccountsQuery): Promise<unknown> {
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 20;
		const idpAccountResult = await this.idpAccountService.getMany(query.query);
		return {
			data: idpAccountResult.data,
			meta: buildOffsetPageMeta(skip, take, idpAccountResult.totalCount),
		};
	}
}
