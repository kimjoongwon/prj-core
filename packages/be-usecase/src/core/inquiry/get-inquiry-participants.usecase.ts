import { InquiryAggregate } from "@cocrepo/aggregate";
import { GetInquiryParticipantsQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetInquiryParticipantsQuery)
export class GetInquiryParticipantsUseCase
	implements IQueryHandler<GetInquiryParticipantsQuery>
{
	constructor(private readonly inquiryService: InquiryAggregate) {}

	execute(query: GetInquiryParticipantsQuery): Promise<unknown> {
		return this.inquiryService.getParticipants(query.inquiryId);
	}
}
