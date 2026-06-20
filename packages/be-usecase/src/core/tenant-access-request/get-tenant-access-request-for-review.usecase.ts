import { TenantAccessRequestAggregate } from "@cocrepo/aggregate";
import { GetTenantAccessRequestForReviewQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTenantAccessRequestForReviewQuery)
export class GetTenantAccessRequestForReviewUseCase {
	constructor(
		private readonly tenantAccessRequestService: TenantAccessRequestAggregate,
	) {}

	execute(query: GetTenantAccessRequestForReviewQuery): Promise<unknown> {
		return this.tenantAccessRequestService.findForReview({
			tenantAccessRequestId: query.tenantAccessRequestId,
			reviewerId: query.reviewerId,
		});
	}
}
