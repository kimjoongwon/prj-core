import { InquiryAggregate } from "@cocrepo/aggregate";
import { GetInquiryMessagesQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetInquiryMessagesQuery)
export class GetInquiryMessagesUseCase {
	constructor(private readonly inquiryService: InquiryAggregate) {}

	async execute(query: GetInquiryMessagesQuery): Promise<unknown> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 50;
		const messageResult = await this.inquiryService.listMessages(query);
		return buildOffsetPaginatedResponse(
			messageResult.items,
			messageResult.totalCount,
			skip,
			take,
		);
	}
}
