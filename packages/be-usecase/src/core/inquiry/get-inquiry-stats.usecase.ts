import { SpaceContext } from "@cocrepo/context";
import { InquiryAggregate } from "@cocrepo/aggregate";
import { GetInquiryStatsQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetInquiryStatsQuery)
export class GetInquiryStatsUseCase {
	constructor(
		private readonly inquiryService: InquiryAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(): Promise<unknown> {
		return this.inquiryService.getStats(this.spaceContext.spaceIds);
	}
}
