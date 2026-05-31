import type { QueryAuthAuditLogDto } from "@cocrepo/dto";

export class GetAuthAuditLogsQuery {
	constructor(readonly query: QueryAuthAuditLogDto) {}
}
