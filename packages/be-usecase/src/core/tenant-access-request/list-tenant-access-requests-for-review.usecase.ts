import { TenantAccessRequestAggregate } from "@cocrepo/aggregate";
import { ListTenantAccessRequestsForReviewQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(ListTenantAccessRequestsForReviewQuery)
export class ListTenantAccessRequestsForReviewUseCase
	implements IQueryHandler<ListTenantAccessRequestsForReviewQuery>
{
	constructor(
		private readonly tenantAccessRequestService: TenantAccessRequestAggregate,
	) {}

	async execute(
		query: ListTenantAccessRequestsForReviewQuery,
	): Promise<unknown> {
		const skip = query.params.skip ?? 0;
		const take = query.params.take ?? 10;
		const tenantAccessRequestResult =
			await this.tenantAccessRequestService.listForReview(query.params);
		return buildOffsetPaginatedResponse(
			tenantAccessRequestResult.items,
			tenantAccessRequestResult.totalCount,
			skip,
			take,
		);
	}
}
