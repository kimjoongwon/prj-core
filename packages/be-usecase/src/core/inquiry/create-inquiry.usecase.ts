import { InquiryAggregateRoot } from "@cocrepo/aggregate";
import { CreateInquiryCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateInquiryCommand)
export class CreateInquiryUseCase
	implements ICommandHandler<CreateInquiryCommand>
{
	constructor(private readonly inquiryService: InquiryAggregateRoot) {}

	execute(command: CreateInquiryCommand): Promise<unknown> {
		return this.inquiryService.create(
			{
				spaceId: command.spaceId,
				title: command.dto.title,
				category: command.dto.category,
				channel: command.dto.channel,
				source: command.dto.source,
				priority: command.dto.priority,
				customerId: command.dto.customerId,
				assigneeId: command.dto.assigneeId,
			},
			command.actorUserId,
			command.dto.content,
		);
	}
}
