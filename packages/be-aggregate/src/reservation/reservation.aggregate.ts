import { RESERVATION_ERRORS } from "@cocrepo/constant";
import type { Reservation } from "@cocrepo/entity";
import {
	type RecurringDayOfWeek,
	RepeatCycleTypes,
	ReservationStatus,
	SessionTypes,
} from "@cocrepo/prisma";
import {
	type BookingProgramRecord,
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
import { ACTIVE_RESERVATION_STATUSES } from "./active-reservation-statuses";
import type { BookingFeedInput, CreateReservationInput } from "@cocrepo/input";
import { CONFIRMED_CANCEL_CUTOFF_HOURS } from "./confirmed-cancel-cutoff-hours";
import { DEFAULT_FEED_WINDOW_DAYS } from "./default-feed-window-days";
import { DEFAULT_SESSION_DURATION_MINUTES } from "./default-session-duration-minutes";
import { FEW_LEFT_THRESHOLD } from "./few-left-threshold";
import { RESERVATION_AVAILABILITY } from "./reservation-availability";

@Injectable()
export class ReservationAggregate {
	private readonly logger = new Logger(ReservationAggregate.name);

	constructor(
		private readonly repository: ReservationsRepository,
		private readonly tenantsRepository: TenantsRepository,
	) {}

	async getBookingFeed(input: BookingFeedInput) {
		const feedWindow = this.resolveFeedWindow(input.from, input.to);
		const programs = await this.repository.findBookingPrograms({
			spaceId: input.spaceId,
			from: feedWindow.from,
			to: feedWindow.to,
			timelineId: input.timelineId,
			programId: input.programId,
			search: input.search,
			skip: input.skip,
			take: input.take,
		});
		const occurrences = programs.flatMap((program) =>
			this.expandOccurrences(program, feedWindow.from, feedWindow.to),
		);
		const programIds = Array.from(
			new Set(occurrences.map((item) => item.program.id)),
		);
		const [reservations, coachNames] = await Promise.all([
			this.repository.findReservationsForFeed({
				spaceId: input.spaceId,
				userId: input.userId,
				from: feedWindow.from,
				to: feedWindow.to,
				programIds,
			}),
			this.repository.findCoachNames(
				programs.map((program) => program.instructorId),
			),
		]);

		const reservationsByOccurrence =
			this.groupReservationsByOccurrence(reservations);

		const items = occurrences
			.sort((left, right) => left.startsAt.getTime() - right.startsAt.getTime())
			.map((occurrence) =>
				this.toBookingFeedItem({
					program: occurrence.program,
					startsAt: occurrence.startsAt,
					endsAt: occurrence.endsAt,
					reservations:
						reservationsByOccurrence.get(
							this.buildOccurrenceKey(
								occurrence.program.id,
								occurrence.startsAt,
							),
						) ?? [],
					userId: input.userId,
					coachName: coachNames.get(occurrence.program.instructorId) ?? null,
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
		const createResult = await this.createWithResult(params);
		return createResult.reservation;
	}

	@Transactional()
	async createWithResult(params: {
		spaceId: string;
		userId: string;
		input: CreateReservationInput;
	}) {
		this.logger.debug(
			`예약 생성 요청: user=${params.userId.slice(-8)}, program=${params.input.programId.slice(-8)}`,
		);

		const tenantId = await this.assertUserCanBookSpace(
			params.userId,
			params.spaceId,
		);

		const existingByKey = await this.repository.findByUserAndIdempotencyKey(
			params.userId,
			params.input.idempotencyKey,
		);
		if (existingByKey) {
			return {
				created: false,
				reservation: existingByKey,
			};
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

		const reservation = await this.repository.create({
			tenantId,
			userId: params.userId,
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

		return {
			created: true,
			reservation,
		};
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
		reservation.cancel({ cancelReason: params.cancelReason, now });
		const canceled = await this.repository.save(reservation);

		if (wasConfirmed) {
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
	): Promise<string> {
		const tenant = await this.tenantsRepository.findActiveByUserIdAndSpaceId(
			userId,
			spaceId,
		);
		if (!tenant) {
			throw new ForbiddenException(RESERVATION_ERRORS.SPACE_ACCESS_REQUIRED);
		}
		return tenant.id;
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

		const nextWaitlistedSpaceId = nextWaitlisted.tenant?.spaceId;
		if (!nextWaitlistedSpaceId) {
			throw new BadRequestException(RESERVATION_ERRORS.INVALID_DATA);
		}

		nextWaitlisted.confirmFromWaitlist(params.now);
		await this.repository.save(nextWaitlisted);
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
	}) {
		const confirmedCount = params.reservations.filter(
			(reservation) => reservation.status === ReservationStatus.CONFIRMED,
		).length;
		const waitlistCount = params.reservations.filter(
			(reservation) => reservation.status === ReservationStatus.WAITLISTED,
		).length;
		const myReservation =
			params.reservations.find(
				(reservation) =>
					reservation.userId === params.userId &&
					ACTIVE_RESERVATION_STATUSES.includes(reservation.status),
			) ??
			params.reservations.find(
				(reservation) => reservation.userId === params.userId,
			);
		const availableSeatCount = Math.max(
			params.program.capacity - confirmedCount,
			0,
		);
		const myReservationStatus = myReservation?.status ?? null;
		const availabilityStatus = this.resolveAvailabilityStatus({
			startsAt: params.startsAt,
			availableSeatCount,
			myReservationStatus,
		});

		return {
			feedItemId: `${params.program.id}:${params.startsAt.toISOString()}`,
			date: params.startsAt.toISOString().slice(0, 10),
			startsAt: params.startsAt,
			endsAt: params.endsAt,
			timelineId: params.program.session.timeline.id,
			sessionId: params.program.session.id,
			programId: params.program.id,
			timelineName: params.program.session.timeline.name,
			sessionName: params.program.session.name,
			programName: params.program.name,
			coachName: params.coachName,
			capacity: params.program.capacity,
			confirmedCount,
			availableSeatCount,
			waitlistCount,
			availabilityStatus,
			myReservationStatus,
			ctaLabel: this.resolveCtaLabel({
				availabilityStatus,
				myReservationStatus,
			}),
			cancelableUntilAt: this.resolveConfirmedCancelableUntilAt(
				params.startsAt,
			),
			level: params.program.level,
			routineLabelSnapshot: params.program.routineLabelSnapshot,
			previewExerciseNames: params.program.programActivities
				.slice(0, 3)
				.map((activity) => activity.exerciseName),
		};
	}

	private resolveCtaLabel(params: {
		availabilityStatus: (typeof RESERVATION_AVAILABILITY)[keyof typeof RESERVATION_AVAILABILITY];
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
	}): (typeof RESERVATION_AVAILABILITY)[keyof typeof RESERVATION_AVAILABILITY] {
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
