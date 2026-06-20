import {
	AuthAuditLogAggregate,
	type GetAuditLogsResult,
} from "@cocrepo/aggregate";
import { GetAuthAuditLogsQuery } from "@cocrepo/command";
import { PageMetaDto } from "@cocrepo/dto";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAuthAuditLogsQuery)
export class GetAuthAuditLogsUseCase {
	constructor(private readonly authAuditLogService: AuthAuditLogAggregate) {}

	async execute(query: GetAuthAuditLogsQuery): Promise<{
		data: GetAuditLogsResult["logs"];
		meta: PageMetaDto;
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
			meta: new PageMetaDto(skip, take, auditLogsResult.totalCount),
		};
	}
}
