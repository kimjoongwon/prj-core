import type { ReviewTenantAccessRequestDto } from "@cocrepo/dto";

export class ApproveTenantAccessRequestCommand {
	constructor(
		readonly tenantAccessRequestId: string,
		readonly reviewerId: string,
		readonly dto: ReviewTenantAccessRequestDto,
	) {}
}
