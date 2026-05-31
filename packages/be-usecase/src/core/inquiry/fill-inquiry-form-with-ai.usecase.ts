import { InquiryAggregateRoot } from "@cocrepo/aggregate";
import { FillInquiryFormWithAiQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FillInquiryFormWithAiQuery)
export class FillInquiryFormWithAiUseCase
	implements IQueryHandler<FillInquiryFormWithAiQuery>
{
	constructor(private readonly inquiryService: InquiryAggregateRoot) {}

	async execute(query: FillInquiryFormWithAiQuery): Promise<unknown> {
		return this.inquiryService.fillFormWithAi(query.input);
	}
}
