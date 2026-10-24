export class GetTenantAccessRequestForReviewQuery {
	constructor(
		readonly tenantAccessRequestId: bigint,
		readonly reviewerSeq: bigint,
	) {}
}
