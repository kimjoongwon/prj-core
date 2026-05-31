import type { ReviewTenantAccessRequestDto } from "@cocrepo/dto";

export class RejectTenantAccessRequestCommand {
	constructor(
		readonly tenantAccessRequestId: string,
		readonly reviewerId: string,
		readonly dto: ReviewTenantAccessRequestDto,
	) {}
}
