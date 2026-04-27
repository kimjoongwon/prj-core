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
import { AuthContext, SpaceContext, TimelineService } from "@cocrepo/service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class TimelineFacade {
	constructor(
		private readonly timelinesService: TimelineService,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	async getTimelines(query: QueryTimelineDto): Promise<{
		data: Awaited<ReturnType<TimelineService["findTimelines"]>>["timelines"];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
		stats: {
			total: number;
		};
	}> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}

		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const { timelines, total } = await this.timelinesService.findTimelines({
			skip,
			take,
			search: query.search ?? null,
		});

		return {
			data: timelines,
			meta: {
				total,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(total / take) : 1,
			},
			stats: {
				total,
			},
		};
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
	): Promise<{
		data: Awaited<
			ReturnType<TimelineService["findSessionsInTimeline"]>
		>["sessions"];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
	}> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const { sessions, total } =
			await this.timelinesService.findSessionsInTimeline(timelineId, {
				skip,
				take,
			});

		return {
			data: sessions,
			meta: {
				total,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(total / take) : 1,
			},
		};
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
	): Promise<{
		data: Awaited<
			ReturnType<TimelineService["findProgramsInSession"]>
		>["programs"];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
	}> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const { programs, total } =
			await this.timelinesService.findProgramsInSession(sessionId, {
				skip,
				take,
			});

		return {
			data: programs,
			meta: {
				total,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(total / take) : 1,
			},
		};
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
