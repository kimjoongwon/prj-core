import { InquiryAggregate } from "@cocrepo/aggregate";
import { CreateInquiryCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateInquiryCommand)
export class CreateInquiryUseCase {
	constructor(private readonly inquiryService: InquiryAggregate) {}

	execute(command: CreateInquiryCommand): Promise<unknown> {
		return this.inquiryService.create(
			{
				spaceSeq: command.spaceSeq,
				createdBySeq: command.actorUserId,
				title: command.title,
				category: command.category,
				channel: command.channel,
				source: command.source,
				priority: command.priority,
				customerSeq: command.customerSeq,
				assigneeSeq: command.assigneeSeq,
			},
			command.actorUserId,
			command.content,
		);
	}
}
