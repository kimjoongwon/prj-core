import type { ApproveTenantAccessRequestCommandInput } from "./approve-tenant-access-request.input";
export class ApproveTenantAccessRequestCommand {
	constructor(
		readonly tenantAccessRequestId: string,
		readonly reviewerId: string,
		readonly input: ApproveTenantAccessRequestCommandInput,
	) {}
}
