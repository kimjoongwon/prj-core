import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { TIMELINE_ERRORS } from "@cocrepo/constant";
import {
	CreateProgramDto,
	CreateSessionDto,
	CreateTimelineDto,
	QueryProgramDto,
	QuerySessionDto,
	QueryTimelineDto,
	UpdateProgramDto,
	UpdateSessionDto,
	UpdateTimelineDto,
} from "@cocrepo/dto";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import {
	buildOffsetPaginatedResponse,
	buildOffsetStatsPaginatedResponse,
} from "@cocrepo/toolkit";
import type {
	OffsetPaginatedResponse,
	OffsetStatsPaginatedResponse,
} from "@cocrepo/type";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class TimelineFacade {
	constructor(
		private readonly timelinesService: TimelineAggregateRoot,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	async getTimelines(
		query: QueryTimelineDto,
	): Promise<
		OffsetStatsPaginatedResponse<
			Awaited<ReturnType<TimelineAggregateRoot["findTimelines"]>>["timelines"]
		>
	> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}

		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const timelineResult = await this.timelinesService.findTimelines({
			skip,
			take,
			search: query.search ?? null,
			contentLanguageCode: query.contentLanguageCode,
		});

		return buildOffsetStatsPaginatedResponse(
			timelineResult.timelines,
			timelineResult.total,
			skip,
			take,
		);
	}

	getTimelineById(timelineId: string) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}

		return this.timelinesService.findTimelineForSpace(
			timelineId,
			this.spaceContext.spaceIds,
		);
	}

	createTimeline(dto: CreateTimelineDto) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}

		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.NOT_FOUND);
		}

		return this.timelinesService.createTimeline(dto, spaceId, userId);
	}

	updateTimeline(timelineId: string, dto: UpdateTimelineDto) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}

		return this.timelinesService.updateTimelineForSpace(
			timelineId,
			dto,
			spaceId,
		);
	}

	deleteTimeline(timelineId: string): Promise<void> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}

		return this.timelinesService.deleteTimelineFromSpace(timelineId, spaceId);
	}

	async getSessions(
		timelineId: string,
		query: QuerySessionDto,
	): Promise<
		OffsetPaginatedResponse<
			Awaited<
				ReturnType<TimelineAggregateRoot["findSessionsInTimeline"]>
			>["sessions"]
		>
	> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const sessionResult = await this.timelinesService.findSessionsInTimeline(
			timelineId,
			{
				skip,
				take,
			},
		);

		return buildOffsetPaginatedResponse(
			sessionResult.sessions,
			sessionResult.total,
			skip,
			take,
		);
	}

	getSessionById(timelineId: string, sessionId: string) {
		return this.timelinesService.findSessionInTimeline(timelineId, sessionId);
	}

	createSession(timelineId: string, dto: CreateSessionDto) {
		return this.timelinesService.createSessionInTimeline(timelineId, dto);
	}

	updateSession(timelineId: string, sessionId: string, dto: UpdateSessionDto) {
		return this.timelinesService.updateSessionInTimeline(
			timelineId,
			sessionId,
			dto,
		);
	}

	deleteSession(timelineId: string, sessionId: string): Promise<void> {
		return this.timelinesService.deleteSessionFromTimeline(
			timelineId,
			sessionId,
		);
	}

	async getPrograms(
		sessionId: string,
		query: QueryProgramDto,
	): Promise<
		OffsetPaginatedResponse<
			Awaited<
				ReturnType<TimelineAggregateRoot["findProgramsInSession"]>
			>["programs"]
		>
	> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const programResult = await this.timelinesService.findProgramsInSession(
			sessionId,
			{
				skip,
				take,
			},
		);

		return buildOffsetPaginatedResponse(
			programResult.programs,
			programResult.total,
			skip,
			take,
		);
	}

	getProgramById(sessionId: string, programId: string) {
		return this.timelinesService.findProgramInSession(sessionId, programId);
	}

	createProgram(sessionId: string, dto: CreateProgramDto) {
		return this.timelinesService.createProgramInSession(sessionId, {
			name: dto.name,
			routineId: dto.routineId,
			instructorId: dto.instructorId,
			capacity: dto.capacity,
			level: dto.level ?? null,
		});
	}

	updateProgram(sessionId: string, programId: string, dto: UpdateProgramDto) {
		return this.timelinesService.updateProgramInSession(sessionId, programId, {
			name: dto.name,
			routineId: dto.routineId,
			instructorId: dto.instructorId,
			capacity: dto.capacity,
			level: dto.level,
		});
	}

	deleteProgram(sessionId: string, programId: string): Promise<void> {
		return this.timelinesService.deleteProgramFromSession(sessionId, programId);
	}
}
