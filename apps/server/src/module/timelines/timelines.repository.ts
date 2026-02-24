import { Session, Timeline } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class TimelinesRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("TimelinesRepository");
	}

	// ============================================================================
	// Timeline 쿼리 메서드
	// ============================================================================

	/**
	 * 타임라인 목록 조회
	 */
	async findManyTimelines(params: {
		spaceId: string;
		skip: number;
		take: number;
		search?: string;
	}): Promise<{ items: Timeline[]; count: number }> {
		const { spaceId, skip, take, search } = params;
		this.logger.debug(`타임라인 목록 조회: spaceId=${spaceId.slice(-8)}`);

		const where: Prisma.TimelineWhereInput = {
			spaceId,
			removedAt: null,
			name: search ? { contains: search, mode: "insensitive" } : undefined,
		};

		const [items, count] = await Promise.all([
			this.txHost.tx.timeline.findMany({
				where,
				include: {
					_count: {
						select: { sessions: { where: { removedAt: null } } },
					},
					creator: { select: { id: true, name: true } },
				},
				orderBy: { createdAt: "desc" },
				skip,
				take,
			}),
			this.txHost.tx.timeline.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(Timeline, item)),
			count,
		};
	}

	/**
	 * ID로 타임라인 조회
	 */
	async findTimelineById(
		timelineId: string,
		spaceId: string,
	): Promise<Timeline | null> {
		this.logger.debug(`ID로 타임라인 조회: timelineId=${timelineId.slice(-8)}`);

		const result = await this.txHost.tx.timeline.findFirst({
			where: { id: timelineId, spaceId, removedAt: null },
			include: {
				creator: { select: { id: true, name: true } },
				space: {
					select: {
						id: true,
						ground: { select: { name: true } },
					},
				},
				_count: {
					select: { sessions: { where: { removedAt: null } } },
				},
			},
		});

		return result ? plainToInstance(Timeline, result) : null;
	}

	/**
	 * 타임라인 생성
	 */
	async createTimeline(
		data: Prisma.TimelineUncheckedCreateInput,
	): Promise<Timeline> {
		this.logger.debug("타임라인 생성 중...");

		const result = await this.txHost.tx.timeline.create({
			data,
		});

		return plainToInstance(Timeline, result);
	}

	/**
	 * 타임라인 수정
	 */
	async updateTimeline(
		timelineId: string,
		data: Prisma.TimelineUncheckedUpdateInput,
	): Promise<Timeline> {
		this.logger.debug(`타임라인 수정 중: ${timelineId.slice(-8)}`);

		const result = await this.txHost.tx.timeline.update({
			where: { id: timelineId },
			data,
		});

		return plainToInstance(Timeline, result);
	}

	/**
	 * 타임라인 소프트 삭제
	 */
	async removeTimelineById(timelineId: string): Promise<Timeline> {
		this.logger.debug(`타임라인 소프트 삭제 중: ${timelineId.slice(-8)}`);

		const result = await this.txHost.tx.timeline.update({
			where: { id: timelineId },
			data: { removedAt: new Date() },
		});

		return plainToInstance(Timeline, result);
	}

	/**
	 * 타임라인 이름 중복 확인
	 */
	async countTimelinesWithName(
		name: string,
		spaceId: string,
		excludeId?: string,
	): Promise<number> {
		this.logger.debug(
			`타임라인 이름 중복 확인: name=${name}, spaceId=${spaceId.slice(-8)}`,
		);

		return this.txHost.tx.timeline.count({
			where: {
				name,
				spaceId,
				removedAt: null,
				...(excludeId && { NOT: { id: excludeId } }),
			},
		});
	}

	// ============================================================================
	// Session 쿼리 메서드
	// ============================================================================

	/**
	 * 세션 목록 조회
	 */
	async findManySessions(
		timelineId: string,
		params: {
			skip: number;
			take: number;
			search?: string;
		},
	): Promise<{ items: Session[]; count: number }> {
		const { skip, take, search } = params;
		this.logger.debug(`세션 목록 조회: timelineId=${timelineId.slice(-8)}`);

		const where: Prisma.SessionWhereInput = {
			timelineId,
			removedAt: null,
			name: search ? { contains: search, mode: "insensitive" } : undefined,
		};

		const [items, count] = await Promise.all([
			this.txHost.tx.session.findMany({
				where,
				include: {
					_count: {
						select: { programs: { where: { removedAt: null } } },
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take,
			}),
			this.txHost.tx.session.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(Session, item)),
			count,
		};
	}

	/**
	 * ID로 세션 조회
	 */
	async findSessionById(
		timelineId: string,
		sessionId: string,
	): Promise<Session | null> {
		this.logger.debug(`ID로 세션 조회: sessionId=${sessionId.slice(-8)}`);

		const result = await this.txHost.tx.session.findFirst({
			where: { id: sessionId, timelineId, removedAt: null },
			include: {
				timeline: { select: { id: true, name: true } },
				_count: {
					select: { programs: { where: { removedAt: null } } },
				},
			},
		});

		return result ? plainToInstance(Session, result) : null;
	}

	/**
	 * 세션 생성
	 */
	async createSession(
		data: Prisma.SessionUncheckedCreateInput,
	): Promise<Session> {
		this.logger.debug("세션 생성 중...");

		const result = await this.txHost.tx.session.create({
			data,
		});

		return plainToInstance(Session, result);
	}

	/**
	 * 세션 수정
	 */
	async updateSession(
		sessionId: string,
		data: Prisma.SessionUncheckedUpdateInput,
	): Promise<Session> {
		this.logger.debug(`세션 수정 중: ${sessionId.slice(-8)}`);

		const result = await this.txHost.tx.session.update({
			where: { id: sessionId },
			data,
		});

		return plainToInstance(Session, result);
	}

	/**
	 * 세션 소프트 삭제
	 */
	async removeSessionById(sessionId: string): Promise<Session> {
		this.logger.debug(`세션 소프트 삭제 중: ${sessionId.slice(-8)}`);

		const result = await this.txHost.tx.session.update({
			where: { id: sessionId },
			data: { removedAt: new Date() },
		});

		return plainToInstance(Session, result);
	}
}
