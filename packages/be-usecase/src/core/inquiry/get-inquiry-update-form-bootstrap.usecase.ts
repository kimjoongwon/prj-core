import { InquiryAggregateRoot } from "@cocrepo/aggregate";
import { GetInquiryUpdateFormBootstrapQuery } from "@cocrepo/command";
import { SpaceContext } from "@cocrepo/service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetInquiryUpdateFormBootstrapQuery)
export class GetInquiryUpdateFormBootstrapUseCase
	implements IQueryHandler<GetInquiryUpdateFormBootstrapQuery>
{
	constructor(
		private readonly inquiryService: InquiryAggregateRoot,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(query: GetInquiryUpdateFormBootstrapQuery): Promise<unknown> {
		return this.inquiryService.getUpdateFormBootstrap(
			query.inquiryId,
			this.spaceContext.spaceIds,
		);
	}
}
