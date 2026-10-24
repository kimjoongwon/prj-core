import type { RejectTenantAccessRequestCommandInput } from "@cocrepo/input";
export class RejectTenantAccessRequestCommand
	implements RejectTenantAccessRequestCommandInput
{
	readonly reviewComment?: RejectTenantAccessRequestCommandInput["reviewComment"];

	constructor(
		readonly tenantAccessRequestId: bigint,
		readonly reviewerSeq: bigint,
		input: RejectTenantAccessRequestCommandInput,
	) {
		Object.assign(this, input);
	}
}
