import { TimelineAggregate } from "@cocrepo/aggregate";
import { CreateTimelineCommand } from "@cocrepo/command";
import { TIMELINE_ERRORS } from "@cocrepo/constant";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateTimelineCommand)
export class CreateTimelineUseCase {
	constructor(
		private readonly timelinesService: TimelineAggregate,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(command: CreateTimelineCommand): Promise<unknown> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}
		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.NOT_FOUND);
		}
		return this.timelinesService.createTimeline(command.input, spaceId, userId);
	}
}
