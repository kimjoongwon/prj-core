import { InquiryAggregate } from "@cocrepo/aggregate";
import { CreateInquiryCommand } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateInquiryCommand)
export class CreateInquiryUseCase {
	constructor(
		private readonly inquiryService: InquiryAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(command: CreateInquiryCommand): Promise<unknown> {
		const tenantId = this.spaceContext.tenantId;
		if (!tenantId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.inquiryService.create(
			{
				tenantId,
				title: command.title,
				category: command.category,
				channel: command.channel,
				source: command.source,
				priority: command.priority,
				customerId: command.customerId,
				assigneeId: command.assigneeId,
			},
			command.actorUserId,
			command.content,
		);
	}
}
