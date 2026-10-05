import { InquiryAggregate } from "@cocrepo/aggregate";
import { UpdateInquiryCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateInquiryCommand)
export class UpdateInquiryUseCase {
	constructor(private readonly inquiryService: InquiryAggregate) {}

	execute(command: UpdateInquiryCommand): Promise<unknown> {
		return this.inquiryService.update(command.inquiryId, command);
	}
}
