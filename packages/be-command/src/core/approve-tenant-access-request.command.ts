import type { ApproveTenantAccessRequestCommandInput } from "@cocrepo/input";
export class ApproveTenantAccessRequestCommand
	implements ApproveTenantAccessRequestCommandInput
{
	readonly reviewComment?: ApproveTenantAccessRequestCommandInput["reviewComment"];

	constructor(
		readonly tenantAccessRequestId: bigint,
		readonly reviewerId: bigint,
		input: ApproveTenantAccessRequestCommandInput,
	) {
		Object.assign(this, input);
	}
}
