import { OidcClientAggregate } from "@cocrepo/aggregate";
import { GetOidcClientsQuery } from "@cocrepo/command";
import { PageMetaDto } from "@cocrepo/dto";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetOidcClientsQuery)
export class GetOidcClientsUseCase {
	constructor(private readonly oidcClientService: OidcClientAggregate) {}

	async execute(query: GetOidcClientsQuery): Promise<unknown> {
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 20;
		const oidcClientResult = await this.oidcClientService.getMany(query.query);
		return {
			data: oidcClientResult.data,
			meta: new PageMetaDto(skip, take, oidcClientResult.totalCount),
		};
	}
}
