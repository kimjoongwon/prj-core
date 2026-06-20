import { InquiryAggregate } from "@cocrepo/aggregate";
import { GetInquiryMessagesQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetInquiryMessagesQuery)
export class GetInquiryMessagesUseCase
	implements IQueryHandler<GetInquiryMessagesQuery>
{
	constructor(private readonly inquiryService: InquiryAggregate) {}

	async execute(query: GetInquiryMessagesQuery): Promise<unknown> {
		const skip = query.params.skip ?? 0;
		const take = query.params.take ?? 50;
		const messageResult = await this.inquiryService.listMessages(query.params);
		return buildOffsetPaginatedResponse(
			messageResult.items,
			messageResult.totalCount,
			skip,
			take,
		);
	}
}
