import { InquiryAggregate } from "@cocrepo/aggregate";
import { ListInquiriesQuery } from "@cocrepo/command";
import { SpaceContext } from "@cocrepo/context";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(ListInquiriesQuery)
export class ListInquiriesUseCase {
	constructor(
		private readonly inquiryService: InquiryAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(query: ListInquiriesQuery): Promise<unknown> {
		const skip = query.params.skip ?? 0;
		const take = query.params.take ?? 10;
		const inquiryResult = await this.inquiryService.list({
			...query.params,
			spaceIds: this.spaceContext.spaceIds,
		});
		return buildOffsetPaginatedResponse(
			inquiryResult.items,
			inquiryResult.totalCount,
			skip,
			take,
		);
	}
}
