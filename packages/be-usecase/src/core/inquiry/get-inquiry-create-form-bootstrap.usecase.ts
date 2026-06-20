import { InquiryAggregate } from "@cocrepo/aggregate";
import { GetInquiryCreateFormBootstrapQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetInquiryCreateFormBootstrapQuery)
export class GetInquiryCreateFormBootstrapUseCase
	implements IQueryHandler<GetInquiryCreateFormBootstrapQuery>
{
	constructor(private readonly inquiryService: InquiryAggregate) {}

	execute(): Promise<unknown> {
		return this.inquiryService.getCreateFormBootstrap();
	}
}
