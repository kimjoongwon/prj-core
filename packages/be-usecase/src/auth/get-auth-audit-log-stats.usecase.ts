import { AuthAuditLogAggregate } from "@cocrepo/aggregate";
import { GetAuthAuditLogStatsQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAuthAuditLogStatsQuery)
export class GetAuthAuditLogStatsUseCase {
	constructor(private readonly authAuditLogService: AuthAuditLogAggregate) {}

	execute() {
		return this.authAuditLogService.getStats();
	}
}
