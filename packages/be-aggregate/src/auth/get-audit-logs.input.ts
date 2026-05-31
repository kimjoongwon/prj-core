import type { Prisma } from "@cocrepo/prisma";

export interface GetAuditLogsInput {
	email?: string;
	result?: Prisma.AuthAuditLogWhereInput["result"];
	ipAddress?: string;
	clientId?: string;
	startDate?: Date;
	endDate?: Date;
	sort?: string[];
	skip?: number;
	take?: number;
}
