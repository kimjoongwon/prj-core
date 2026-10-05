import type { GetAuthAuditLogsQueryInput } from "@cocrepo/input";

export class GetAuthAuditLogsQuery implements GetAuthAuditLogsQueryInput {
	readonly email?: GetAuthAuditLogsQueryInput["email"];
	readonly result?: GetAuthAuditLogsQueryInput["result"];
	readonly ipAddress?: GetAuthAuditLogsQueryInput["ipAddress"];
	readonly clientId?: GetAuthAuditLogsQueryInput["clientId"];
	readonly startDate?: GetAuthAuditLogsQueryInput["startDate"];
	readonly endDate?: GetAuthAuditLogsQueryInput["endDate"];
	readonly sort?: GetAuthAuditLogsQueryInput["sort"];
	readonly skip?: GetAuthAuditLogsQueryInput["skip"];
	readonly take?: GetAuthAuditLogsQueryInput["take"];

	constructor(input: GetAuthAuditLogsQueryInput) {
		Object.assign(this, input);
	}
}
