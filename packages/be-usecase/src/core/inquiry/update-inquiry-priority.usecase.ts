import { InquiryAggregate } from "@cocrepo/aggregate";
import { UpdateInquiryPriorityCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateInquiryPriorityCommand)
export class UpdateInquiryPriorityUseCase {
	constructor(private readonly inquiryService: InquiryAggregate) {}

	execute(command: UpdateInquiryPriorityCommand): Promise<unknown> {
		return this.inquiryService.updatePriority(
			command.inquiryId,
			command.priority,
		);
	}
}
