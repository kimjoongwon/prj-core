import {
	AuthAuditLogAggregate,
	type GetAuditLogsResult,
} from "@cocrepo/aggregate";
import { GetAuthAuditLogsQuery } from "@cocrepo/command";
import { buildOffsetPageMeta, type IPageMeta } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAuthAuditLogsQuery)
export class GetAuthAuditLogsUseCase {
	constructor(private readonly authAuditLogService: AuthAuditLogAggregate) {}

	async execute(query: GetAuthAuditLogsQuery): Promise<{
		data: GetAuditLogsResult["logs"];
		meta: IPageMeta;
	}> {
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 20;
		const auditLogsResult = await this.authAuditLogService.getAuditLogs({
			email: query.query.email,
			result: query.query.result,
			ipAddress: query.query.ipAddress,
			clientId: query.query.clientId,
			startDate: query.query.startDate,
			endDate: query.query.endDate,
			sort: (query.query as { sort?: string[] }).sort,
			skip,
			take,
		});

		return {
			data: auditLogsResult.logs,
			meta: buildOffsetPageMeta(skip, take, auditLogsResult.totalCount),
		};
	}
}
