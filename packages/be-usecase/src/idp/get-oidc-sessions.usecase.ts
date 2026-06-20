import { OidcSessionAggregate } from "@cocrepo/aggregate";
import { GetOidcSessionsQuery } from "@cocrepo/command";
import { PageMetaDto } from "@cocrepo/dto";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetOidcSessionsQuery)
export class GetOidcSessionsUseCase {
	constructor(private readonly oidcSessionService: OidcSessionAggregate) {}

	async execute(query: GetOidcSessionsQuery): Promise<unknown> {
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 20;
		const oidcSessionResult = await this.oidcSessionService.getMany(
			query.query,
		);
		return {
			data: oidcSessionResult.data,
			meta: new PageMetaDto(skip, take, oidcSessionResult.totalCount),
		};
	}
}
