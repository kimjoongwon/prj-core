import type { RejectTenantAccessRequestCommandInput } from "./reject-tenant-access-request.input";
export class RejectTenantAccessRequestCommand {
	constructor(
		readonly tenantAccessRequestId: string,
		readonly reviewerId: string,
		readonly input: RejectTenantAccessRequestCommandInput,
	) {}
}
