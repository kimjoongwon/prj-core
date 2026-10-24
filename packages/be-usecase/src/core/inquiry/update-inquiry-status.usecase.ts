import { InquiryAggregate } from "@cocrepo/aggregate";
import { UpdateInquiryStatusCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateInquiryStatusCommand)
export class UpdateInquiryStatusUseCase {
	constructor(private readonly inquiryService: InquiryAggregate) {}

	execute(command: UpdateInquiryStatusCommand): Promise<unknown> {
		return this.inquiryService.updateStatus(command.inquiryId, command.status);
	}
}
