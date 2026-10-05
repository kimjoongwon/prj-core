import { TenantAccessRequestAggregate } from "@cocrepo/aggregate";
import { ListTenantAccessRequestsForReviewQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(ListTenantAccessRequestsForReviewQuery)
export class ListTenantAccessRequestsForReviewUseCase {
	constructor(
		private readonly tenantAccessRequestService: TenantAccessRequestAggregate,
	) {}

	async execute(
		query: ListTenantAccessRequestsForReviewQuery,
	): Promise<unknown> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const tenantAccessRequestResult =
			await this.tenantAccessRequestService.listForReview(query);
		return buildOffsetPaginatedResponse(
			tenantAccessRequestResult.items,
			tenantAccessRequestResult.totalCount,
			skip,
			take,
		);
	}
}
