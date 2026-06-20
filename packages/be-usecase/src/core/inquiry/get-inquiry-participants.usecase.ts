import { InquiryAggregate } from "@cocrepo/aggregate";
import { GetInquiryParticipantsQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetInquiryParticipantsQuery)
export class GetInquiryParticipantsUseCase {
	constructor(private readonly inquiryService: InquiryAggregate) {}

	execute(query: GetInquiryParticipantsQuery): Promise<unknown> {
		return this.inquiryService.getParticipants(query.inquiryId);
	}
}
