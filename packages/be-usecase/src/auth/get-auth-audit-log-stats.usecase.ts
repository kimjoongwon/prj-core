import { AuthAuditLogAggregateRoot } from "@cocrepo/aggregate";
import { GetAuthAuditLogStatsQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAuthAuditLogStatsQuery)
export class GetAuthAuditLogStatsUseCase
	implements IQueryHandler<GetAuthAuditLogStatsQuery>
{
	constructor(
		private readonly authAuditLogService: AuthAuditLogAggregateRoot,
	) {}

	execute() {
		return this.authAuditLogService.getStats();
	}
}
