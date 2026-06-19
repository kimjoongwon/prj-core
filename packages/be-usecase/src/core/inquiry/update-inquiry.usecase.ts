import { InquiryAggregateRoot } from "@cocrepo/aggregate";
import { UpdateInquiryCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateInquiryCommand)
export class UpdateInquiryUseCase
	implements ICommandHandler<UpdateInquiryCommand>
{
	constructor(private readonly inquiryService: InquiryAggregateRoot) {}

	execute(command: UpdateInquiryCommand): Promise<unknown> {
		return this.inquiryService.update(command.inquiryId, command.input);
	}
}
