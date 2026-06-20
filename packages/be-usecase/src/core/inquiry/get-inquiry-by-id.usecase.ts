import { InquiryAggregate } from "@cocrepo/aggregate";
import { GetInquiryByIdQuery } from "@cocrepo/command";
import { SpaceContext } from "@cocrepo/service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetInquiryByIdQuery)
export class GetInquiryByIdUseCase
	implements IQueryHandler<GetInquiryByIdQuery>
{
	constructor(
		private readonly inquiryService: InquiryAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(query: GetInquiryByIdQuery): Promise<unknown> {
		return this.inquiryService.findByIdWithDetails(
			query.inquiryId,
			this.spaceContext.spaceIds,
		);
	}
}
