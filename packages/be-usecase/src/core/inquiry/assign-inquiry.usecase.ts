import { InquiryAggregate } from "@cocrepo/aggregate";
import { AssignInquiryCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(AssignInquiryCommand)
export class AssignInquiryUseCase {
	constructor(private readonly inquiryService: InquiryAggregate) {}

	execute(command: AssignInquiryCommand): Promise<unknown> {
		return this.inquiryService.assignTo(command.inquiryId, command.assigneeId);
	}
}
