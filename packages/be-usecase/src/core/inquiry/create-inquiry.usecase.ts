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
				title: command.input.title,
				category: command.input.category,
				channel: command.input.channel,
				source: command.input.source,
				priority: command.input.priority,
				customerId: command.input.customerId,
				assigneeId: command.input.assigneeId,
			},
			command.actorUserId,
			command.input.content,
		);
	}
}
