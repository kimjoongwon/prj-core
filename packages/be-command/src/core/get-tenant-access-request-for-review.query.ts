export class GetTenantAccessRequestForReviewQuery {
	constructor(
		readonly tenantAccessRequestId: string,
		readonly reviewerId: string,
	) {}
}
