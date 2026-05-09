import { COURSE_ERRORS, RESERVATION_ERRORS } from "@cocrepo/constant";
import type { BookingFeedItemDto } from "@cocrepo/dto";
import type { CoursePass, Reservation } from "@cocrepo/entity";
import {
	CoursePassStatus,
	type RecurringDayOfWeek,
	RepeatCycleTypes,
	ReservationStatus,
	SessionTypes,
} from "@cocrepo/prisma";
import {
	type BookingProgramRecord,
	CoursesRepository,
	ReservationsRepository,
	TenantsRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

interface CreateReservationInput {
	coursePassId?: string;
	timelineId: string;
	sessionId: string;
	programId: string;
	occurrenceStartAt: Date;
	idempotencyKey: string;
	memo?: string | null;
}

interface BookingFeedInput {
	spaceId: string;
	userId: string;
	from?: Date;
	to?: Date;
	timelineId?: string;
	programId?: string;
	search?: string;
	skip?: number;
	take?: number;
}

const ACTIVE_RESERVATION_STATUSES: readonly ReservationStatus[] = [
	ReservationStatus.CONFIRMED,
	ReservationStatus.WAITLISTED,
];

const DEFAULT_FEED_WINDOW_DAYS = 14;
const DEFAULT_SESSION_DURATION_MINUTES = 60;
const CONFIRMED_CANCEL_CUTOFF_HOURS = 2;
const FEW_LEFT_THRESHOLD = 3;
const RESERVATION_AVAILABILITY = {
	AVAILABLE: "AVAILABLE" as BookingFeedItemDto["availabilityStatus"],
	FEW_LEFT: "FEW_LEFT" as BookingFeedItemDto["availabilityStatus"],
	WAITLIST_OPEN: "WAITLIST_OPEN" as BookingFeedItemDto["availabilityStatus"],
	RESERVED: "RESERVED" as BookingFeedItemDto["availabilityStatus"],
	WAITLISTED: "WAITLISTED" as BookingFeedItemDto["availabilityStatus"],
	BOOKING_CLOSED: "BOOKING_CLOSED" as BookingFeedItemDto["availabilityStatus"],
} as const;

@Injectable()
export class ReservationService {
	private readonly logger = new Logger(ReservationService.name);

	constructor(
		private readonly repository: ReservationsRepository,
		private readonly tenantsRepository: TenantsRepository,
		private readonly coursesRepository?: CoursesRepository,
	) {}

	async getBookingFeed(
		input: BookingFeedInput,
	): Promise<{ items: BookingFeedItemDto[]; totalCount: number }> {
		const { from, to } = this.resolveFeedWindow(input.from, input.to);
		const programs = await this.repository.findBookingPrograms({
			spaceId: input.spaceId,
			from,
			to,
			timelineId: input.timelineId,
			programId: input.programId,
			search: input.search,
			skip: input.skip,
			take: input.take,
		});
		const occurrences = programs.flatMap((program) =>
			this.expandOccurrences(program, from, to),
		);
		const programIds = Array.from(
			new Set(occurrences.map((item) => item.program.id)),
		);
		const [reservations, coachNames, coursePasses] = await Promise.all([
			this.repository.findReservationsForFeed({
				spaceId: input.spaceId,
				userId: input.userId,
				from,
				to,
				programIds,
			}),
			this.repository.findCoachNames(
				programs.map((program) => program.instructorId),
			),
			this.findReservableCoursePasses({
				from,
				spaceId: input.spaceId,
				to,
				userId: input.userId,
			}),
		]);

		const reservationsByOccurrence =
			this.groupReservationsByOccurrence(reservations);

		const items = occurrences
			.sort((left, right) => left.startsAt.getTime() - right.startsAt.getTime())
			.map(({ program, startsAt, endsAt }) =>
				this.toBookingFeedItem({
					program,
					startsAt,
					endsAt,
					reservations:
						reservationsByOccurrence.get(
							this.buildOccurrenceKey(program.id, startsAt),
						) ?? [],
					userId: input.userId,
					coachName: coachNames.get(program.instructorId) ?? null,
					coursePasses,
				}),
			);

		return {
			items,
			totalCount: items.length,
		};
	}

	async getMine(params: {
		spaceId: string;
		userId: string;
		from?: Date;
		to?: Date;
		status?: ReservationStatus;
		skip?: number;
		take?: number;
	}): Promise<{ items: Reservation[]; totalCount: number }> {
		return this.repository.findMine(params);
	}

	@Transactional()
	async create(params: {
		spaceId: string;
		userId: string;
		input: CreateReservationInput;
	}): Promise<Reservation> {
		this.logger.debug(
			`예약 생성 요청: user=${params.userId.slice(-8)}, program=${params.input.programId.slice(-8)}`,
		);

		await this.assertUserCanBookSpace(params.userId, params.spaceId);

		const existingByKey = await this.repository.findByUserAndIdempotencyKey(
			params.userId,
			params.input.idempotencyKey,
		);
		if (existingByKey) {
			return existingByKey;
		}

		const program = await this.repository.findBookingProgram({
			spaceId: params.spaceId,
			timelineId: params.input.timelineId,
			sessionId: params.input.sessionId,
			programId: params.input.programId,
		});
		if (!program) {
			throw new NotFoundException(RESERVATION_ERRORS.PROGRAM_NOT_FOUND);
		}

		this.assertOccurrenceBelongsToSession(
			program,
			params.input.occurrenceStartAt,
		);

		const coursePassId = await this.assertCoursePassCanReserve({
			coursePassId: params.input.coursePassId,
			userId: params.userId,
			spaceId: params.spaceId,
			timelineId: params.input.timelineId,
			occurrenceStartAt: params.input.occurrenceStartAt,
		});

		const duplicate = await this.repository.findActiveDuplicate({
			userId: params.userId,
			programId: params.input.programId,
			occurrenceStartAt: params.input.occurrenceStartAt,
		});
		if (duplicate) {
			throw new ConflictException(RESERVATION_ERRORS.ACTIVE_DUPLICATE);
		}

		const confirmedCount = await this.repository.countByProgramOccurrence({
			programId: params.input.programId,
			occurrenceStartAt: params.input.occurrenceStartAt,
			status: ReservationStatus.CONFIRMED,
		});
		const shouldConfirm = confirmedCount < program.capacity;
		const waitlistPosition = shouldConfirm
			? null
			: (await this.repository.getMaxWaitlistPosition({
					programId: params.input.programId,
					occurrenceStartAt: params.input.occurrenceStartAt,
				})) + 1;
		const now = new Date();
		if (shouldConfirm) {
			await this.consumeCoursePassReservation(coursePassId);
		}

		return this.repository.create({
			spaceId: params.spaceId,
			userId: params.userId,
			coursePassId,
			timelineId: params.input.timelineId,
			sessionId: params.input.sessionId,
			programId: params.input.programId,
			occurrenceStartAt: params.input.occurrenceStartAt,
			status: shouldConfirm
				? ReservationStatus.CONFIRMED
				: ReservationStatus.WAITLISTED,
			memo: params.input.memo ?? null,
			idempotencyKey: params.input.idempotencyKey,
			waitlistPosition,
			confirmedAt: shouldConfirm ? now : null,
			canceledAt: null,
			cancelReason: null,
		});
	}

	@Transactional()
	async cancel(params: {
		spaceId: string;
		userId: string;
		reservationId: string;
		cancelReason?: string | null;
		now?: Date;
	}): Promise<Reservation> {
		const reservation = await this.repository.findByIdForUser({
			reservationId: params.reservationId,
			userId: params.userId,
			spaceId: params.spaceId,
		});
		if (!reservation) {
			throw new NotFoundException(RESERVATION_ERRORS.RESERVATION_NOT_FOUND);
		}
		if (reservation.status === ReservationStatus.CANCELED) {
			throw new ConflictException(RESERVATION_ERRORS.ALREADY_CANCELED);
		}

		const now = params.now ?? new Date();
		const cancelableUntilAt =
			reservation.status === ReservationStatus.CONFIRMED
				? this.resolveConfirmedCancelableUntilAt(reservation.occurrenceStartAt)
				: reservation.occurrenceStartAt;
		if (now >= cancelableUntilAt) {
			throw new BadRequestException(RESERVATION_ERRORS.CANCEL_CUTOFF_PASSED);
		}

		const wasConfirmed = reservation.status === ReservationStatus.CONFIRMED;
		const canceled = await this.repository.updateById(reservation.id, {
			status: ReservationStatus.CANCELED,
			canceledAt: now,
			cancelReason: params.cancelReason ?? null,
			waitlistPosition: null,
		});

		if (wasConfirmed) {
			await this.releaseCoursePassReservation(reservation.coursePassId);
			await this.promoteWaitlistIfPossible({
				programId: reservation.programId,
				occurrenceStartAt: reservation.occurrenceStartAt,
				now,
			});
		}

		return canceled;
	}

	private async assertUserCanBookSpace(
		userId: string,
		spaceId: string,
	): Promise<void> {
		const tenant = await this.tenantsRepository.findActiveByUserIdAndSpaceId(
			userId,
			spaceId,
		);
		if (!tenant) {
			throw new ForbiddenException(RESERVATION_ERRORS.SPACE_ACCESS_REQUIRED);
		}
	}

	private async assertCoursePassCanReserve(params: {
		coursePassId?: string;
		userId: string;
		spaceId: string;
		timelineId: string;
		occurrenceStartAt: Date;
	}): Promise<string> {
		if (!params.coursePassId) {
			throw new BadRequestException(COURSE_ERRORS.COURSE_PASS_REQUIRED);
		}

		const coursePass = await this.getCoursesRepository().findCoursePassById(
			params.coursePassId,
		);
		if (!coursePass) {
			throw new NotFoundException(COURSE_ERRORS.COURSE_PASS_NOT_FOUND);
		}
		if (coursePass.userId !== params.userId) {
			throw new ForbiddenException(COURSE_ERRORS.COURSE_PASS_USER_MISMATCH);
		}
		if (coursePass.timelineId !== params.timelineId) {
			throw new BadRequestException(
				COURSE_ERRORS.COURSE_PASS_TIMELINE_MISMATCH,
			);
		}

		const passSpaceId =
			coursePass.courseOffering?.spaceId ?? coursePass.course?.spaceId;
		if (!passSpaceId || passSpaceId !== params.spaceId) {
			throw new ForbiddenException(COURSE_ERRORS.COURSE_PASS_SPACE_MISMATCH);
		}
		if (coursePass.status !== CoursePassStatus.ACTIVE || coursePass.removedAt) {
			throw new BadRequestException(COURSE_ERRORS.COURSE_PASS_INACTIVE);
		}
		if (params.occurrenceStartAt < coursePass.validFrom) {
			throw new BadRequestException(COURSE_ERRORS.COURSE_PASS_NOT_YET_VALID);
		}
		if (params.occurrenceStartAt > coursePass.expiresAt) {
			throw new BadRequestException(COURSE_ERRORS.COURSE_PASS_EXPIRED);
		}
		if (coursePass.reservationRemainingCount <= 0) {
			throw new BadRequestException(COURSE_ERRORS.COURSE_PASS_NO_REMAINING);
		}
		return params.coursePassId;
	}

	private async promoteWaitlistIfPossible(params: {
		programId: string;
		occurrenceStartAt: Date;
		now: Date;
	}): Promise<void> {
		const nextWaitlisted = await this.repository.findNextWaitlisted(params);
		if (!nextWaitlisted) {
			return;
		}

		const coursePassId = await this.assertCoursePassCanReserve({
			coursePassId: nextWaitlisted.coursePassId,
			userId: nextWaitlisted.userId,
			spaceId: nextWaitlisted.spaceId,
			timelineId: nextWaitlisted.timelineId,
			occurrenceStartAt: nextWaitlisted.occurrenceStartAt,
		});
		await this.consumeCoursePassReservation(coursePassId);

		await this.repository.updateById(nextWaitlisted.id, {
			status: ReservationStatus.CONFIRMED,
			waitlistPosition: null,
			confirmedAt: params.now,
		});
	}

	private getCoursesRepository(): CoursesRepository {
		if (!this.coursesRepository) {
			throw new Error("CoursesRepository provider is required");
		}
		return this.coursesRepository;
	}

	private async consumeCoursePassReservation(
		coursePassId: string,
	): Promise<void> {
		await this.getCoursesRepository().updateCoursePassUsageById(coursePassId, {
			reservationUsedCount: { increment: 1 },
			reservationRemainingCount: { decrement: 1 },
		});
	}

	private async releaseCoursePassReservation(
		coursePassId: string,
	): Promise<void> {
		await this.getCoursesRepository().updateCoursePassUsageById(coursePassId, {
			reservationUsedCount: { decrement: 1 },
			reservationRemainingCount: { increment: 1 },
		});
	}

	private resolveFeedWindow(from?: Date, to?: Date): { from: Date; to: Date } {
		const start = from ?? new Date();
		const end =
			to ??
			new Date(
				start.getTime() + DEFAULT_FEED_WINDOW_DAYS * 24 * 60 * 60 * 1000,
			);
		if (end < start) {
			throw new BadRequestException(RESERVATION_ERRORS.INVALID_DATA);
		}
		return { from: start, to: end };
	}

	private expandOccurrences(
		program: BookingProgramRecord,
		from: Date,
		to: Date,
	): Array<{ program: BookingProgramRecord; startsAt: Date; endsAt: Date }> {
		const session = program.session;
		if (!session.startDateTime) {
			return [];
		}

		if (session.type !== SessionTypes.RECURRING) {
			if (session.startDateTime < from || session.startDateTime > to) {
				return [];
			}
			return [
				{
					program,
					startsAt: session.startDateTime,
					endsAt: this.resolveEndsAt(
						session.startDateTime,
						session.endDateTime,
					),
				},
			];
		}

		if (!session.recurringDayOfWeek) {
			return [];
		}

		const occurrences: Array<{
			program: BookingProgramRecord;
			startsAt: Date;
			endsAt: Date;
		}> = [];
		const cursor = this.atSessionTime(from, session.startDateTime);
		while (cursor <= to) {
			if (
				this.matchesRecurringDay(cursor, session.recurringDayOfWeek) &&
				this.matchesRepeatCycle(
					cursor,
					session.startDateTime,
					session.repeatCycleType,
				)
			) {
				const startsAt = new Date(cursor);
				occurrences.push({
					program,
					startsAt,
					endsAt: this.resolveEndsAt(startsAt, session.endDateTime),
				});
			}
			cursor.setUTCDate(cursor.getUTCDate() + 1);
		}

		return occurrences;
	}

	private assertOccurrenceBelongsToSession(
		program: BookingProgramRecord,
		occurrenceStartAt: Date,
	): void {
		const occurrences = this.expandOccurrences(
			program,
			new Date(occurrenceStartAt.getTime() - 1000),
			new Date(occurrenceStartAt.getTime() + 1000),
		);
		const isValid = occurrences.some(
			(item) => item.startsAt.getTime() === occurrenceStartAt.getTime(),
		);
		if (!isValid) {
			throw new BadRequestException(RESERVATION_ERRORS.CONNECTION_INVALID);
		}
	}

	private resolveEndsAt(startsAt: Date, sessionEndsAt: Date | null): Date {
		if (sessionEndsAt && sessionEndsAt > startsAt) {
			const duration = sessionEndsAt.getTime() - startsAt.getTime();
			return new Date(startsAt.getTime() + duration);
		}
		return new Date(
			startsAt.getTime() + DEFAULT_SESSION_DURATION_MINUTES * 60 * 1000,
		);
	}

	private atSessionTime(date: Date, sessionStart: Date): Date {
		const next = new Date(date);
		next.setUTCHours(
			sessionStart.getUTCHours(),
			sessionStart.getUTCMinutes(),
			sessionStart.getUTCSeconds(),
			sessionStart.getUTCMilliseconds(),
		);
		if (next < date) {
			next.setUTCDate(next.getUTCDate() + 1);
		}
		return next;
	}

	private matchesRecurringDay(
		date: Date,
		dayOfWeek: RecurringDayOfWeek,
	): boolean {
		const dayMap: Record<RecurringDayOfWeek, number> = {
			MONDAY: 1,
			TUESDAY: 2,
			WEDNESDAY: 3,
			THURSDAY: 4,
			FRIDAY: 5,
			SATURDAY: 6,
			SUNDAY: 0,
		};
		return date.getUTCDay() === dayMap[dayOfWeek];
	}

	private matchesRepeatCycle(
		date: Date,
		seriesStart: Date,
		repeatCycleType: RepeatCycleTypes | null,
	): boolean {
		if (repeatCycleType !== RepeatCycleTypes.MONTHLY) {
			return true;
		}
		return date.getUTCDate() === seriesStart.getUTCDate();
	}

	private groupReservationsByOccurrence(
		reservations: Reservation[],
	): Map<string, Reservation[]> {
		const groups = new Map<string, Reservation[]>();
		for (const reservation of reservations) {
			const key = this.buildOccurrenceKey(
				reservation.programId,
				reservation.occurrenceStartAt,
			);
			const group = groups.get(key) ?? [];
			group.push(reservation);
			groups.set(key, group);
		}
		return groups;
	}

	private toBookingFeedItem(params: {
		program: BookingProgramRecord;
		startsAt: Date;
		endsAt: Date;
		reservations: Reservation[];
		userId: string;
		coachName: string | null;
		coursePasses: CoursePass[];
	}): BookingFeedItemDto {
		const {
			program,
			startsAt,
			endsAt,
			reservations,
			userId,
			coachName,
			coursePasses,
		} = params;
		const confirmedCount = reservations.filter(
			(reservation) => reservation.status === ReservationStatus.CONFIRMED,
		).length;
		const waitlistCount = reservations.filter(
			(reservation) => reservation.status === ReservationStatus.WAITLISTED,
		).length;
		const myReservation =
			reservations.find(
				(reservation) =>
					reservation.userId === userId &&
					ACTIVE_RESERVATION_STATUSES.includes(reservation.status),
			) ?? reservations.find((reservation) => reservation.userId === userId);
		const coursePassId = this.resolveCoursePassIdForFeed({
			coursePasses,
			myReservation,
			program,
			startsAt,
		});
		const availableSeatCount = Math.max(program.capacity - confirmedCount, 0);
		const myReservationStatus = myReservation?.status ?? null;
		const availabilityStatus = this.resolveAvailabilityStatus({
			startsAt,
			availableSeatCount,
			myReservationStatus,
		});

		return {
			feedItemId: `${program.id}:${startsAt.toISOString()}`,
			date: startsAt.toISOString().slice(0, 10),
			startsAt,
			endsAt,
			timelineId: program.session.timeline.id,
			sessionId: program.session.id,
			programId: program.id,
			coursePassId,
			timelineName: program.session.timeline.name,
			sessionName: program.session.name,
			programName: program.name,
			coachName,
			capacity: program.capacity,
			confirmedCount,
			availableSeatCount,
			waitlistCount,
			availabilityStatus,
			myReservationStatus,
			ctaLabel: this.resolveCtaLabel({
				availabilityStatus,
				myReservationStatus,
			}),
			cancelableUntilAt: this.resolveConfirmedCancelableUntilAt(startsAt),
			level: program.level,
			routineLabelSnapshot: program.routineLabelSnapshot,
			previewExerciseNames: program.programActivities
				.slice(0, 3)
				.map((activity) => activity.exerciseName),
		};
	}

	private async findReservableCoursePasses(params: {
		spaceId: string;
		userId: string;
		from: Date;
		to: Date;
	}): Promise<CoursePass[]> {
		if (!this.coursesRepository) {
			return [];
		}

		const { items } = await this.coursesRepository.findManyCoursePasses({
			where: {
				userId: params.userId,
				status: CoursePassStatus.ACTIVE,
				validFrom: { lte: params.to },
				expiresAt: { gte: params.from },
				reservationRemainingCount: { gt: 0 },
				OR: [
					{ courseOffering: { spaceId: params.spaceId } },
					{ course: { spaceId: params.spaceId } },
				],
			},
			orderBy: [{ expiresAt: "asc" }],
			take: 200,
		});

		return items;
	}

	private resolveCoursePassIdForFeed(params: {
		coursePasses: CoursePass[];
		myReservation?: Reservation;
		program: BookingProgramRecord;
		startsAt: Date;
	}): string | null {
		if (params.myReservation?.coursePassId) {
			return params.myReservation.coursePassId;
		}

		const matchingPass = params.coursePasses.find(
			(coursePass) =>
				coursePass.timelineId === params.program.session.timeline.id &&
				coursePass.canReserveAt(params.startsAt),
		);

		return matchingPass?.id ?? null;
	}

	private resolveCtaLabel(params: {
		availabilityStatus: BookingFeedItemDto["availabilityStatus"];
		myReservationStatus: ReservationStatus | null;
	}): string {
		if (params.availabilityStatus === RESERVATION_AVAILABILITY.RESERVED) {
			return "예약됨";
		}
		if (params.availabilityStatus === RESERVATION_AVAILABILITY.WAITLISTED) {
			return "대기중";
		}
		if (params.availabilityStatus === RESERVATION_AVAILABILITY.BOOKING_CLOSED) {
			return "마감";
		}
		if (params.availabilityStatus === RESERVATION_AVAILABILITY.WAITLIST_OPEN) {
			return "대기";
		}
		return "예약";
	}

	private resolveAvailabilityStatus(params: {
		startsAt: Date;
		availableSeatCount: number;
		myReservationStatus: ReservationStatus | null;
	}): BookingFeedItemDto["availabilityStatus"] {
		if (params.myReservationStatus === ReservationStatus.CONFIRMED) {
			return RESERVATION_AVAILABILITY.RESERVED;
		}
		if (params.myReservationStatus === ReservationStatus.WAITLISTED) {
			return RESERVATION_AVAILABILITY.WAITLISTED;
		}
		if (params.startsAt <= new Date()) {
			return RESERVATION_AVAILABILITY.BOOKING_CLOSED;
		}
		if (params.availableSeatCount <= 0) {
			return RESERVATION_AVAILABILITY.WAITLIST_OPEN;
		}
		if (params.availableSeatCount <= FEW_LEFT_THRESHOLD) {
			return RESERVATION_AVAILABILITY.FEW_LEFT;
		}
		return RESERVATION_AVAILABILITY.AVAILABLE;
	}

	private resolveConfirmedCancelableUntilAt(startsAt: Date): Date {
		return new Date(
			startsAt.getTime() - CONFIRMED_CANCEL_CUTOFF_HOURS * 60 * 60 * 1000,
		);
	}

	private buildOccurrenceKey(programId: string, startsAt: Date): string {
		return `${programId}:${startsAt.toISOString()}`;
	}
}
