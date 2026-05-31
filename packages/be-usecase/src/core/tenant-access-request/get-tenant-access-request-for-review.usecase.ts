import { TenantAccessRequestAggregateRoot } from "@cocrepo/aggregate";
import { GetTenantAccessRequestForReviewQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTenantAccessRequestForReviewQuery)
export class GetTenantAccessRequestForReviewUseCase
	implements IQueryHandler<GetTenantAccessRequestForReviewQuery>
{
	constructor(
		private readonly tenantAccessRequestService: TenantAccessRequestAggregateRoot,
	) {}

	execute(query: GetTenantAccessRequestForReviewQuery): Promise<unknown> {
		return this.tenantAccessRequestService.findForReview({
			tenantAccessRequestId: query.tenantAccessRequestId,
			reviewerId: query.reviewerId,
		});
	}
}
