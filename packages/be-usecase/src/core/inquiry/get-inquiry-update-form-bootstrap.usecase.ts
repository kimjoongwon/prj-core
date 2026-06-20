import { SpaceContext } from "@cocrepo/context";
import { InquiryAggregate } from "@cocrepo/aggregate";
import { GetInquiryUpdateFormBootstrapQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetInquiryUpdateFormBootstrapQuery)
export class GetInquiryUpdateFormBootstrapUseCase {
	constructor(
		private readonly inquiryService: InquiryAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(query: GetInquiryUpdateFormBootstrapQuery): Promise<unknown> {
		return this.inquiryService.getUpdateFormBootstrap(
			query.inquiryId,
			this.spaceContext.spaceIds,
		);
	}
}
