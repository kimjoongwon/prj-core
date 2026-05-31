import type { AuthAuditLogsRepository } from "@cocrepo/repository";

export interface GetAuditLogsResult {
	logs: Awaited<ReturnType<AuthAuditLogsRepository["findMany"]>>["logs"];
	totalCount: number;
}
