import { InquiryAggregate } from "@cocrepo/aggregate";
import { FillInquiryFormWithAiQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FillInquiryFormWithAiQuery)
export class FillInquiryFormWithAiUseCase {
	constructor(private readonly inquiryService: InquiryAggregate) {}

	async execute(query: FillInquiryFormWithAiQuery): Promise<unknown> {
		return this.inquiryService.fillFormWithAi(query);
	}
}
