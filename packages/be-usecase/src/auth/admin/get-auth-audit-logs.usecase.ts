import { AuthAuditLogAggregate } from "@cocrepo/aggregate";
import { GetAuthAuditLogsQuery } from "@cocrepo/command";
import { buildOffsetPageMeta } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAuthAuditLogsQuery)
export class GetAuthAuditLogsUseCase {
	constructor(private readonly authAuditLogService: AuthAuditLogAggregate) {}

	async execute(query: GetAuthAuditLogsQuery): Promise<unknown> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;
		const auditLogsResult = await this.authAuditLogService.getAuditLogs({
			email: query.email,
			result: query.result,
			ipAddress: query.ipAddress,
			clientId: query.clientId,
			startDate: query.startDate,
			endDate: query.endDate,
			sort: (query as { sort?: string[] }).sort,
			skip,
			take,
		});

		return {
			data: auditLogsResult.logs,
			meta: buildOffsetPageMeta(skip, take, auditLogsResult.totalCount),
		};
	}
}
