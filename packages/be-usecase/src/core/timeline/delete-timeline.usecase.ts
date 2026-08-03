import { TimelineAggregate } from "@cocrepo/aggregate";
import { DeleteTimelineCommand } from "@cocrepo/command";
import { TIMELINE_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteTimelineCommand)
export class DeleteTimelineUseCase {
	constructor(
		private readonly timelinesService: TimelineAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(command: DeleteTimelineCommand): Promise<void> {
		const spaceId = this.spaceContext.tenant?.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}
		return this.timelinesService.deleteTimelineFromSpace(
			command.timelineId,
			spaceId,
		);
	}
}
