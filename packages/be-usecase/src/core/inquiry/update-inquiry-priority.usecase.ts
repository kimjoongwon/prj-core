import { InquiryAggregateRoot } from "@cocrepo/aggregate";
import { UpdateInquiryPriorityCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateInquiryPriorityCommand)
export class UpdateInquiryPriorityUseCase
	implements ICommandHandler<UpdateInquiryPriorityCommand>
{
	constructor(private readonly inquiryService: InquiryAggregateRoot) {}

	execute(command: UpdateInquiryPriorityCommand): Promise<unknown> {
		return this.inquiryService.updatePriority(
			command.inquiryId,
			command.priority,
		);
	}
}
