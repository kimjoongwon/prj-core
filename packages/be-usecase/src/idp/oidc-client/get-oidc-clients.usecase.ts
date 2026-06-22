import { OidcClientAggregate } from "@cocrepo/aggregate";
import { GetOidcClientsQuery } from "@cocrepo/command";
import { buildOffsetPageMeta } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetOidcClientsQuery)
export class GetOidcClientsUseCase {
	constructor(private readonly oidcClientService: OidcClientAggregate) {}

	async execute(query: GetOidcClientsQuery): Promise<unknown> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;
		const oidcClientResult = await this.oidcClientService.getMany(query);
		return {
			data: oidcClientResult.data,
			meta: buildOffsetPageMeta(skip, take, oidcClientResult.totalCount),
		};
	}
}
