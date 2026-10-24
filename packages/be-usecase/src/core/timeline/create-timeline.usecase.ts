import { TimelineAggregate } from "@cocrepo/aggregate";
import { CreateTimelineCommand } from "@cocrepo/command";
import { TIMELINE_ERRORS } from "@cocrepo/constant";
import { AuthContext, SpaceContext } from "@cocrepo/context";
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
		const spaceSeq = this.spaceContext.tenant?.spaceSeq;
		if (!spaceSeq) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}
		const userSeq = this.authContext.userDto?.id;
		if (!userSeq) {
			throw new UnauthorizedException(TIMELINE_ERRORS.NOT_FOUND);
		}
		return this.timelinesService.createTimeline(command, spaceSeq, userSeq);
	}
}
