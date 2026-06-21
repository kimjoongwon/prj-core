import { OidcSessionAggregate } from "@cocrepo/aggregate";
import { GetOidcSessionsQuery } from "@cocrepo/command";
import { buildOffsetPageMeta } from "@cocrepo/toolkit";
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
			meta: buildOffsetPageMeta(skip, take, oidcSessionResult.totalCount),
		};
	}
}
