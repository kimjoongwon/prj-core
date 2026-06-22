import type { AuthAuditResult } from "@cocrepo/prisma";

export interface GetAuditLogsInput {
	email?: string;
	result?: AuthAuditResult;
	ipAddress?: string;
	clientId?: string;
	startDate?: Date;
	endDate?: Date;
	sort?: string[];
	skip?: number;
	take?: number;
}
