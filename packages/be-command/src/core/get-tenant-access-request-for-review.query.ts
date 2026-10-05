export class GetTenantAccessRequestForReviewQuery {
	constructor(
		readonly tenantAccessRequestId: bigint,
		readonly reviewerId: bigint,
	) {}
}
