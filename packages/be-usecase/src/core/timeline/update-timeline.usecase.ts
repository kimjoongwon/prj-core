import { TimelineAggregate } from "@cocrepo/aggregate";
import { UpdateTimelineCommand } from "@cocrepo/command";
import { TIMELINE_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateTimelineCommand)
export class UpdateTimelineUseCase {
	constructor(
		private readonly timelinesService: TimelineAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(command: UpdateTimelineCommand): Promise<unknown> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}
		return this.timelinesService.updateTimelineForSpace(
			command.timelineId,
			command,
			spaceId,
		);
	}
}
