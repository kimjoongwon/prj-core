import { InquiryAggregate } from "@cocrepo/aggregate";
import { GetInquiryStatsQuery } from "@cocrepo/command";
import { SpaceContext } from "@cocrepo/service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetInquiryStatsQuery)
export class GetInquiryStatsUseCase
	implements IQueryHandler<GetInquiryStatsQuery>
{
	constructor(
		private readonly inquiryService: InquiryAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(): Promise<unknown> {
		return this.inquiryService.getStats(this.spaceContext.spaceIds);
	}
}
