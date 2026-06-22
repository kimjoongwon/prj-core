import type { ApproveTenantAccessRequestCommandInput } from "@cocrepo/input";
export class ApproveTenantAccessRequestCommand implements ApproveTenantAccessRequestCommandInput {
	readonly reviewComment?: ApproveTenantAccessRequestCommandInput["reviewComment"];

	constructor(
		readonly tenantAccessRequestId: string,
		readonly reviewerId: string,
		input: ApproveTenantAccessRequestCommandInput,
	) {
		Object.assign(this, input);
	}
}
