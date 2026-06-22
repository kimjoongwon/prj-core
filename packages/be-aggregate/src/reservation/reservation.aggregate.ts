import {
	COURSE_ERRORS,
	PAYMENT_ERRORS,
	RESERVATION_ERRORS,
} from "@cocrepo/constant";
import type {
	CourseOffering,
	CoursePass,
	Enrollment,
	Payment,
	Reservation,
} from "@cocrepo/entity";
import {
	CourseOfferingStatus,
	CoursePassStatus,
	CourseStatus,
	EnrollmentStatus,
	PaymentMethod,
	PaymentReferenceType,
	PaymentStatus,
	PaymentSubjectType,
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
import { CurrencyCode, Money } from "@cocrepo/vo";
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { CourseAggregate } from "../course/course.aggregate";
import { PaymentAggregate } from "../payment/payment.aggregate";
import { ACTIVE_RESERVATION_STATUSES } from "./active-reservation-statuses";
import type {
	BookingFeedInput,
	CreateReservationInput,
	ReservationCheckoutBootstrapInput,
	ReservationCheckoutInput,
} from "@cocrepo/input";
import { CHECKOUT_PAYMENT_METHODS } from "./checkout-payment-methods";
import { CHECKOUT_PAYMENT_PROVIDER } from "./checkout-payment-provider";
import { CONFIRMED_CANCEL_CUTOFF_HOURS } from "./confirmed-cancel-cutoff-hours";
import { DEFAULT_FEED_WINDOW_DAYS } from "./default-feed-window-days";
import { DEFAULT_SESSION_DURATION_MINUTES } from "./default-session-duration-minutes";
import { FEW_LEFT_THRESHOLD } from "./few-left-threshold";
import { RESERVATION_AVAILABILITY } from "./reservation-availability";
import { ReservationCheckoutProgressStatus } from "./reservation-checkout-progress-status";

@Injectable()
export class ReservationAggregate {
	private readonly logger = new Logger(ReservationAggregate.name);

	constructor(
		private readonly repository: ReservationsRepository,
		private readonly tenantsRepository: TenantsRepository,
		private readonly coursesRepository?: CoursesRepository,
		private readonly paymentService?: PaymentAggregate,
		private readonly courseService?: CourseAggregate,
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
		const timelineIds = Array.from(
			new Set(occurrences.map((item) => item.program.session.timeline.id)),
		);
		const [reservations, coachNames, coursePasses, checkoutOptionsByTimeline] =
			await Promise.all([
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
				this.findReservableCoursePasses({
					from: feedWindow.from,
					spaceId: input.spaceId,
					to: feedWindow.to,
					userId: input.userId,
				}),
				this.findCheckoutOptionsByTimelineIds({
					spaceId: input.spaceId,
					timelineIds,
				}),
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
					coursePasses,
					checkoutOptions:
						checkoutOptionsByTimeline.get(
							occurrence.program.session.timeline.id,
						) ?? [],
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

	async getCheckoutBootstrap(input: ReservationCheckoutBootstrapInput) {
		await this.assertUserCanBookSpace(input.userId, input.spaceId);

		const checkoutOccurrence =
			await this.resolveCheckoutProgramOccurrence(input);
		const options = await this.findCheckoutOptionsForTimeline({
			spaceId: input.spaceId,
			timelineId: input.timelineId,
		});

		if (options.length === 0) {
			throw new NotFoundException(RESERVATION_ERRORS.CHECKOUT_OPTION_NOT_FOUND);
		}

		return {
			context: this.toCheckoutContext({
				coachName: null,
				endsAt: checkoutOccurrence.endsAt,
				program: checkoutOccurrence.program,
				startsAt: checkoutOccurrence.startsAt,
			}),
			options,
			paymentMethods: [...CHECKOUT_PAYMENT_METHODS],
		};
	}

	@Transactional()
	async checkout(params: ReservationCheckoutInput) {
		this.assertCheckoutPaymentMethod(params.paymentMethod);
		const tenantId = await this.assertUserCanBookSpace(
			params.userId,
			params.spaceId,
		);

		const existingByKey = await this.repository.findByUserAndIdempotencyKey(
			params.userId,
			params.idempotencyKey,
		);
		if (existingByKey) {
			return this.toExistingCheckoutResult(existingByKey);
		}

		const checkoutOccurrence =
			await this.resolveCheckoutProgramOccurrence(params);
		const courseOffering = await this.resolveCheckoutCourseOffering({
			courseOfferingId: params.courseOfferingId,
			spaceId: params.spaceId,
			timelineId: params.timelineId,
		});
		const now = new Date();
		const payment = await this.createCheckoutPayment({
			courseOffering,
			idempotencyKey: params.idempotencyKey,
			method: params.paymentMethod,
			occurrenceStartAt: params.occurrenceStartAt,
			programName: checkoutOccurrence.program.name,
			spaceId: params.spaceId,
			userId: params.userId,
		});
		const enrollment = await this.getCourseService().createEnrollment({
			assignedTimelineId: params.timelineId,
			courseId: courseOffering.courseId,
			courseOfferingId: courseOffering.id,
			currency: this.resolveCourseCurrency(courseOffering),
			paidAmount: this.resolveCoursePriceAmount(courseOffering),
			paidAt: now,
			paymentExternalId: payment.providerPaymentId,
			paymentId: payment.id,
			paymentProvider: payment.provider,
			paymentStatus: PaymentStatus.PAID,
			status: EnrollmentStatus.ACTIVE,
			userId: params.userId,
			validFrom: now,
		});
		const coursePass = this.requireIssuedCoursePass(enrollment);
		const reservation = await this.create({
			spaceId: params.spaceId,
			userId: params.userId,
			input: {
				coursePassId: coursePass.id,
				idempotencyKey: params.idempotencyKey,
				memo: params.memo ?? null,
				occurrenceStartAt: params.occurrenceStartAt,
				programId: params.programId,
				sessionId: params.sessionId,
				timelineId: params.timelineId,
			},
		});

		return {
			coursePass,
			enrollment,
			payment,
			progressSteps: this.createCompletedCheckoutProgressSteps(reservation),
			reservation,
			status: payment.status,
		};
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

		const reservation = await this.repository.create({
			tenantId,
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
			await this.releaseCoursePassReservation(reservation.coursePassId);
			await this.promoteWaitlistIfPossible({
				programId: reservation.programId,
				occurrenceStartAt: reservation.occurrenceStartAt,
				now,
			});
		}

		return canceled;
	}

	private async toExistingCheckoutResult(reservation: Reservation) {
		const coursePass =
			reservation.coursePass ??
			(await this.getCoursesRepository().findCoursePassById(
				reservation.coursePassId,
			));
		if (!coursePass) {
			throw new NotFoundException(COURSE_ERRORS.COURSE_PASS_NOT_FOUND);
		}

		const enrollment = await this.getCourseService().findEnrollmentDetails(
			coursePass.enrollmentId,
		);
		if (!enrollment.payment) {
			throw new NotFoundException(PAYMENT_ERRORS.PAYMENT_NOT_FOUND);
		}

		return {
			coursePass: enrollment.coursePass ?? coursePass,
			enrollment,
			payment: enrollment.payment,
			progressSteps: this.createCompletedCheckoutProgressSteps(reservation),
			reservation,
			status: enrollment.payment.status,
		};
	}

	private createCompletedCheckoutProgressSteps(reservation: Reservation) {
		return [
			{
				id: "reservation-context",
				label: "예약 정보 확인",
				status: ReservationCheckoutProgressStatus.COMPLETED,
			},
			{
				id: "payment-ledger",
				label: "결제 요청 생성",
				status: ReservationCheckoutProgressStatus.COMPLETED,
			},
			{
				id: "payment-approval",
				label: "결제 승인 처리",
				status: ReservationCheckoutProgressStatus.COMPLETED,
			},
			{
				id: "course-pass",
				label: "수강권 활성화",
				status: ReservationCheckoutProgressStatus.COMPLETED,
			},
			{
				id: "reservation",
				label:
					reservation.status === ReservationStatus.WAITLISTED
						? "대기 예약 확정"
						: "예약 확정",
				status: ReservationCheckoutProgressStatus.COMPLETED,
			},
		];
	}

	private async resolveCheckoutProgramOccurrence(
		input: ReservationCheckoutBootstrapInput,
	): Promise<{
		program: BookingProgramRecord;
		startsAt: Date;
		endsAt: Date;
	}> {
		const program = await this.repository.findBookingProgram({
			spaceId: input.spaceId,
			timelineId: input.timelineId,
			sessionId: input.sessionId,
			programId: input.programId,
		});
		if (!program) {
			throw new NotFoundException(RESERVATION_ERRORS.PROGRAM_NOT_FOUND);
		}

		this.assertOccurrenceBelongsToSession(program, input.occurrenceStartAt);

		return {
			endsAt: this.resolveEndsAt(
				input.occurrenceStartAt,
				program.session.endDateTime,
			),
			program,
			startsAt: input.occurrenceStartAt,
		};
	}

	private async findCheckoutOptionsByTimelineIds(params: {
		spaceId: string;
		timelineIds: readonly string[];
	}) {
		if (!this.coursesRepository || params.timelineIds.length === 0) {
			return new Map();
		}

		const result = await this.coursesRepository.findManyOfferings({
			where: {
				course: { is: { status: CourseStatus.ACTIVE } },
				tenant: { spaceId: params.spaceId },
				status: {
					in: [CourseOfferingStatus.ENROLLING, CourseOfferingStatus.ACTIVE],
				},
				timelineId: { in: [...params.timelineIds] },
			},
			orderBy: [{ startsAt: "asc" }, { createdAt: "asc" }],
			take: 200,
		});
		const optionsByTimeline = new Map<
			string,
			Array<ReturnType<typeof this.toCheckoutOption>>
		>();

		for (const offering of result.items) {
			if (!offering.timelineId) {
				continue;
			}
			const option = this.toCheckoutOption(offering);
			const current = optionsByTimeline.get(offering.timelineId) ?? [];
			current.push(option);
			optionsByTimeline.set(offering.timelineId, current);
		}

		return optionsByTimeline;
	}

	private async findCheckoutOptionsForTimeline(params: {
		spaceId: string;
		timelineId: string;
	}) {
		const optionsByTimeline = await this.findCheckoutOptionsByTimelineIds({
			spaceId: params.spaceId,
			timelineIds: [params.timelineId],
		});

		return optionsByTimeline.get(params.timelineId) ?? [];
	}

	private async resolveCheckoutCourseOffering(params: {
		courseOfferingId: string;
		spaceId: string;
		timelineId: string;
	}): Promise<CourseOffering> {
		const courseOffering = await this.getCoursesRepository().findOfferingById(
			params.courseOfferingId,
		);
		if (!courseOffering) {
			throw new NotFoundException(COURSE_ERRORS.COURSE_OFFERING_NOT_FOUND);
		}
		if (
			courseOffering.tenant?.spaceId !== params.spaceId ||
			courseOffering.timelineId !== params.timelineId
		) {
			throw new BadRequestException(
				COURSE_ERRORS.COURSE_OFFERING_SCOPE_INVALID,
			);
		}
		if (
			courseOffering.status !== CourseOfferingStatus.ENROLLING &&
			courseOffering.status !== CourseOfferingStatus.ACTIVE
		) {
			throw new BadRequestException(
				RESERVATION_ERRORS.CHECKOUT_OPTION_NOT_FOUND,
			);
		}

		return courseOffering;
	}

	private async createCheckoutPayment(params: {
		courseOffering: CourseOffering;
		idempotencyKey: string;
		method: PaymentMethod;
		occurrenceStartAt: Date;
		programName: string;
		spaceId: string;
		userId: string;
	}): Promise<Payment> {
		const priceAmount = this.resolveCoursePriceAmount(params.courseOffering);
		const currency = this.resolveCourseCurrency(params.courseOffering);
		const providerPaymentId = `mobile-placeholder-${params.idempotencyKey}`;

		return this.getPaymentService().createPayment({
			approvedAt: new Date(),
			currency,
			method: params.method,
			metadata: {
				checkoutType: "reservation",
				occurrenceStartAt: params.occurrenceStartAt.toISOString(),
				programName: params.programName,
			},
			payerUserId: params.userId,
			provider: CHECKOUT_PAYMENT_PROVIDER,
			providerOrderId: `reservation-checkout-${params.idempotencyKey}`,
			providerPaymentId,
			references: [
				{
					label: params.programName,
					referenceId: params.idempotencyKey,
					referenceType: PaymentReferenceType.SERVICE_USAGE,
					role: "reservation-intent",
					serviceCode: "reservation",
				},
			],
			requestedAt: new Date(),
			status: PaymentStatus.PAID,
			subjects: [
				{
					currency,
					metadata: {
						courseId: params.courseOffering.courseId,
						durationMonths: params.courseOffering.course?.durationMonths,
						timelineId: params.courseOffering.timelineId,
					},
					quantity: 1,
					serviceCode: "course",
					subjectId: params.courseOffering.id,
					subjectLabel: this.resolveCheckoutOptionLabel(params.courseOffering),
					subjectType: PaymentSubjectType.COURSE_OFFERING,
					totalAmount: priceAmount,
					unitAmount: priceAmount,
				},
			],
			title: `${this.resolveCheckoutOptionLabel(params.courseOffering)} 결제`,
			totalAmount: priceAmount,
		});
	}

	private requireIssuedCoursePass(enrollment: Enrollment): CoursePass {
		if (!enrollment.coursePass) {
			throw new BadRequestException(
				COURSE_ERRORS.ENROLLMENT_PASS_TIMELINE_REQUIRED,
			);
		}

		return enrollment.coursePass;
	}

	private assertCheckoutPaymentMethod(method: PaymentMethod): void {
		if (!CHECKOUT_PAYMENT_METHODS.includes(method)) {
			throw new BadRequestException(
				RESERVATION_ERRORS.CHECKOUT_PAYMENT_METHOD_INVALID,
			);
		}
	}

	private toCheckoutContext(params: {
		coachName: string | null;
		endsAt: Date;
		program: BookingProgramRecord;
		startsAt: Date;
	}) {
		return {
			coachName: params.coachName,
			feedItemId: `${params.program.id}:${params.startsAt.toISOString()}`,
			occurrenceEndsAt: params.endsAt,
			occurrenceStartAt: params.startsAt,
			programId: params.program.id,
			programName: params.program.name,
			sessionId: params.program.session.id,
			sessionName: params.program.session.name,
			timelineId: params.program.session.timeline.id,
			timelineName: params.program.session.timeline.name,
		};
	}

	private toCheckoutOption(courseOffering: CourseOffering) {
		return {
			courseId: courseOffering.courseId,
			courseName: courseOffering.course?.name ?? courseOffering.name,
			courseOfferingId: courseOffering.id,
			courseOfferingName: courseOffering.name,
			currency: this.resolveCourseCurrency(courseOffering),
			durationMonths: Math.max(courseOffering.course?.durationMonths ?? 1, 1),
			priceAmount: this.resolveCoursePriceAmount(courseOffering),
			reservationLimit:
				Math.max(courseOffering.course?.durationMonths ?? 1, 1) * 4,
			timelineId: courseOffering.timelineId ?? "",
		};
	}

	private resolveCheckoutOptionLabel(courseOffering: CourseOffering): string {
		const courseName = courseOffering.course?.name ?? "코스";
		return `${courseName} · ${courseOffering.name}`;
	}

	private resolveCoursePriceAmount(courseOffering: CourseOffering): number {
		const currency = CurrencyCode.create(
			courseOffering.course?.currency ?? "KRW",
		);
		return Money.of(courseOffering.course?.basePriceAmount ?? 0, currency)
			.amount;
	}

	private resolveCourseCurrency(courseOffering: CourseOffering): string {
		return CurrencyCode.create(courseOffering.course?.currency ?? "KRW").value;
	}

	private getPaymentService(): PaymentAggregate {
		if (!this.paymentService) {
			throw new Error("PaymentAggregate provider is required");
		}
		return this.paymentService;
	}

	private getCourseService(): CourseAggregate {
		if (!this.courseService) {
			throw new Error("CourseAggregate provider is required");
		}
		return this.courseService;
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

		const passSpaceId = coursePass.courseOffering?.tenant?.spaceId;
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

		const nextWaitlistedSpaceId = nextWaitlisted.tenant?.spaceId;
		if (!nextWaitlistedSpaceId) {
			throw new BadRequestException(RESERVATION_ERRORS.INVALID_DATA);
		}

		const coursePassId = await this.assertCoursePassCanReserve({
			coursePassId: nextWaitlisted.coursePassId,
			userId: nextWaitlisted.userId,
			spaceId: nextWaitlistedSpaceId,
			timelineId: nextWaitlisted.timelineId,
			occurrenceStartAt: nextWaitlisted.occurrenceStartAt,
		});
		await this.consumeCoursePassReservation(coursePassId);

		nextWaitlisted.confirmFromWaitlist(params.now);
		await this.repository.save(nextWaitlisted);
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
		checkoutOptions: Array<ReturnType<typeof this.toCheckoutOption>>;
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
		const coursePassId = this.resolveCoursePassIdForFeed({
			coursePasses: params.coursePasses,
			myReservation,
			program: params.program,
			startsAt: params.startsAt,
		});
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
		const paymentRequired =
			!coursePassId &&
			(availabilityStatus === RESERVATION_AVAILABILITY.AVAILABLE ||
				availabilityStatus === RESERVATION_AVAILABILITY.FEW_LEFT ||
				availabilityStatus === RESERVATION_AVAILABILITY.WAITLIST_OPEN);
		const checkoutPreview = params.checkoutOptions[0] ?? null;

		return {
			feedItemId: `${params.program.id}:${params.startsAt.toISOString()}`,
			date: params.startsAt.toISOString().slice(0, 10),
			startsAt: params.startsAt,
			endsAt: params.endsAt,
			timelineId: params.program.session.timeline.id,
			sessionId: params.program.session.id,
			programId: params.program.id,
			coursePassId,
			paymentRequired,
			paymentRequiredReason: paymentRequired
				? "예약하려면 수강권 결제가 필요합니다"
				: null,
			checkoutPreviewPriceAmount: checkoutPreview?.priceAmount ?? null,
			checkoutPreviewCurrency: checkoutPreview?.currency ?? null,
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
				paymentRequired,
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

	private async findReservableCoursePasses(params: {
		spaceId: string;
		userId: string;
		from: Date;
		to: Date;
	}): Promise<CoursePass[]> {
		if (!this.coursesRepository) {
			return [];
		}

		const coursePassResult = await this.coursesRepository.findManyCoursePasses({
			where: {
				userId: params.userId,
				status: CoursePassStatus.ACTIVE,
				validFrom: { lte: params.to },
				expiresAt: { gte: params.from },
				reservationRemainingCount: { gt: 0 },
				courseOffering: { tenant: { spaceId: params.spaceId } },
			},
			orderBy: [{ expiresAt: "asc" }],
			take: 200,
		});

		return coursePassResult.items;
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
		availabilityStatus: (typeof RESERVATION_AVAILABILITY)[keyof typeof RESERVATION_AVAILABILITY];
		myReservationStatus: ReservationStatus | null;
		paymentRequired?: boolean;
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
			if (params.paymentRequired) {
				return "결제 후 대기";
			}
			return "대기";
		}
		if (params.paymentRequired) {
			return "결제 후 예약";
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
