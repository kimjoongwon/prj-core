import type { RejectTenantAccessRequestCommandInput } from "@cocrepo/input";
export class RejectTenantAccessRequestCommand implements RejectTenantAccessRequestCommandInput {
	readonly reviewComment?: RejectTenantAccessRequestCommandInput["reviewComment"];

	constructor(
		readonly tenantAccessRequestId: string,
		readonly reviewerId: string,
		input: RejectTenantAccessRequestCommandInput,
	) {
		Object.assign(this, input);
	}
}
