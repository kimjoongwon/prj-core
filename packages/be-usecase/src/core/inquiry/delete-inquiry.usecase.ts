import { InquiryAggregate } from "@cocrepo/aggregate";
import { DeleteInquiryCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteInquiryCommand)
export class DeleteInquiryUseCase
	implements ICommandHandler<DeleteInquiryCommand>
{
	constructor(private readonly inquiryService: InquiryAggregate) {}

	execute(command: DeleteInquiryCommand): Promise<unknown> {
		return this.inquiryService.softDelete(command.inquiryId);
	}
}
