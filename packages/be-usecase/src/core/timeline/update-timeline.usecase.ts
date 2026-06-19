import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { UpdateTimelineCommand } from "@cocrepo/command";
import { TIMELINE_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/service";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateTimelineCommand)
export class UpdateTimelineUseCase
	implements ICommandHandler<UpdateTimelineCommand>
{
	constructor(
		private readonly timelinesService: TimelineAggregateRoot,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(command: UpdateTimelineCommand): Promise<unknown> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}
		return this.timelinesService.updateTimelineForSpace(
			command.timelineId,
			command.input,
			spaceId,
		);
	}
}
