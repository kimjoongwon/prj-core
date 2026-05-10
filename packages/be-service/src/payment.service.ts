import { PAYMENT_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import {
	ReservationPaymentCheckoutNextActionType,
} from "@cocrepo/dto";
import type { Payment } from "@cocrepo/entity";
import {
	CourseOfferingStatus,
	CoursePassStatus,
	CourseStatus,
	PaymentMethod,
	PaymentReferenceType,
	PaymentStatus,
	PaymentSubjectType,
	Prisma,
} from "@cocrepo/prisma";
import {
	CoursesRepository,
	type CreatePaymentReferenceInput,
	type CreatePaymentSubjectInput,
	PaymentsRepository,
	ReservationsRepository,
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

export interface PaymentListInput {
	skip?: number;
	take?: number;
	search?: string | null;
	spaceId?: string;
	payerUserId?: string;
	status?: PaymentStatus;
	method?: PaymentMethod;
	provider?: string;
	providerOrderId?: string;
	subjectType?: PaymentSubjectType;
	subjectId?: string;
	referenceType?: PaymentReferenceType;
	referenceId?: string;
	approvedFrom?: Date;
	approvedUntil?: Date;
	sort?: string[];
}

export interface CreatePaymentInput
	extends Omit<
		Prisma.PaymentUncheckedCreateInput,
		| "spaceId"
		| "totalAmount"
		| "currency"
		| "status"
		| "metadata"
		| "subjects"
		| "references"
		| "enrollments"
	> {
	spaceId?: string;
	status?: PaymentStatus;
	totalAmount?: number;
	currency?: string;
	metadata?: Prisma.InputJsonValue | null;
	subjects?: Array<
		Omit<
			CreatePaymentSubjectInput,
			"quantity" | "unitAmount" | "totalAmount" | "currency" | "metadata"
		> & {
			quantity?: number;
			unitAmount?: number;
			totalAmount?: number;
			currency?: string;
			metadata?: Prisma.InputJsonValue | null;
		}
	>;
	references?: Array<
		Omit<CreatePaymentReferenceInput, "role" | "metadata"> & {
			role?: string;
			metadata?: Prisma.InputJsonValue | null;
		}
	>;
}

export interface CreateReservationPaymentCheckoutInput {
	spaceId: string;
	userId: string;
	timelineId: string;
	sessionId: string;
	programId: string;
	occurrenceStartAt: Date;
	idempotencyKey: string;
	provider?: string | null;
	memo?: string | null;
}

export interface ReservationPaymentCheckoutResult {
	payment: Payment;
	providerOrderId: string;
	status: PaymentStatus;
	totalAmount: number;
	currency: string;
	lineItems: Array<{
		label: string;
		quantity: number;
		unitAmount: number;
		totalAmount: number;
		currency: string;
	}>;
	nextAction: {
		type: ReservationPaymentCheckoutNextActionType;
		redirectUrl: string | null;
	};
}

export type UpdatePaymentInput = Omit<
	Prisma.PaymentUncheckedUpdateInput,
	"spaceId" | "payerUserId" | "metadata"
> & {
	metadata?: Prisma.InputJsonValue | null;
};

@Injectable()
export class PaymentService {
	private readonly logger = new Logger(PaymentService.name);

	constructor(
		private readonly repository: PaymentsRepository,
		private readonly spaceContext: SpaceContext,
		private readonly coursesRepository?: CoursesRepository,
		private readonly reservationsRepository?: ReservationsRepository,
	) {}

	async findPayments(
		params: PaymentListInput = {},
	): Promise<{ payments: Payment[]; total: number }> {
		const spaceIds = this.resolveReadableSpaceIds(params.spaceId);
		this.logger.debug(
			`결제 목록 조회: spaceIds=${spaceIds?.length ?? "all"}개`,
		);

		const result = await this.repository.findMany({
			where: this.buildPaymentWhere(params, spaceIds),
			orderBy: this.toPaymentOrderBy(params.sort),
			skip: params.skip,
			take: params.take,
		});

		return { payments: result.items, total: result.totalCount };
	}

	async findPaymentDetails(paymentId: string): Promise<Payment> {
		const payment = await this.repository.findById(paymentId);
		if (!payment) {
			throw new NotFoundException(PAYMENT_ERRORS.PAYMENT_NOT_FOUND);
		}
		this.assertCanReadSpace(payment.spaceId);
		return payment;
	}

	@Transactional()
	async createPayment(data: CreatePaymentInput): Promise<Payment> {
		const spaceId = this.resolveWritableSpaceId(data.spaceId);
		const currency = data.currency ?? "KRW";
		const subjects = this.normalizeSubjects(data.subjects ?? [], currency);
		const references = this.normalizeReferences(data.references ?? []);

		if (subjects.length === 0) {
			throw new BadRequestException(PAYMENT_ERRORS.PAYMENT_SUBJECT_REQUIRED);
		}

		const computedTotalAmount = subjects.reduce(
			(total, subject) => total + subject.totalAmount,
			0,
		);
		const totalAmount = data.totalAmount ?? computedTotalAmount;
		if (totalAmount !== computedTotalAmount) {
			throw new BadRequestException(PAYMENT_ERRORS.PAYMENT_AMOUNT_INVALID);
		}

		const status = data.status ?? PaymentStatus.PENDING;

		return this.repository.create({
			data: {
				spaceId,
				payerUserId: data.payerUserId,
				title: data.title,
				status,
				method: data.method,
				provider: data.provider,
				providerPaymentId: data.providerPaymentId,
				providerOrderId: data.providerOrderId,
				totalAmount,
				currency,
				requestedAt: data.requestedAt ?? new Date(),
				approvedAt:
					data.approvedAt ??
					(status === PaymentStatus.PAID ? new Date() : null),
				canceledAt:
					data.canceledAt ??
					(status === PaymentStatus.CANCELED ? new Date() : null),
				receiptUrl: data.receiptUrl,
				memo: data.memo,
				metadata: this.toNullableJson(data.metadata),
			},
			subjects,
			references,
		});
	}

	@Transactional()
	async createReservationCheckout(
		data: CreateReservationPaymentCheckoutInput,
	): Promise<ReservationPaymentCheckoutResult> {
		const provider = data.provider?.trim() || "provider-neutral";
		const providerOrderId = this.buildReservationCheckoutOrderId(
			data.idempotencyKey,
		);

		await this.assertReservationCheckoutNeedsPayment(data);
		await this.assertReservationCheckoutProgramExists(data);

		const offering = await this.findReservationCheckoutOffering(data);
		const course = offering.course;
		if (!course) {
			throw new NotFoundException(
				PAYMENT_ERRORS.RESERVATION_CHECKOUT_OFFERING_NOT_FOUND,
			);
		}

		const totalAmount = course.basePriceAmount;
		const currency = course.currency || "KRW";
		const subjectLabel = `${course.name} · ${offering.name}`;
		const existing = await this.findExistingReservationCheckout({
			provider,
			providerOrderId,
			spaceId: data.spaceId,
			userId: data.userId,
		});
		const payment =
			existing ??
			(await this.createPayment({
				currency,
				memo: data.memo ?? null,
				metadata: {
					occurrenceStartAt: data.occurrenceStartAt.toISOString(),
					programId: data.programId,
					sessionId: data.sessionId,
					timelineId: data.timelineId,
					type: "reservation-checkout",
				},
				payerUserId: data.userId,
				provider,
				providerOrderId,
				spaceId: data.spaceId,
				status: PaymentStatus.PENDING,
				title: `${course.name} 예약 결제`,
				totalAmount,
				subjects: [
					{
						currency,
						metadata: {
							courseId: course.id,
							courseOfferingId: offering.id,
							timelineId: data.timelineId,
						},
						quantity: 1,
						serviceCode: "core",
						subjectId: offering.id,
						subjectLabel,
						subjectType: PaymentSubjectType.COURSE_OFFERING,
						totalAmount,
						unitAmount: totalAmount,
					},
				],
				references: [
					{
						label: "reservation checkout draft",
						metadata: {
							occurrenceStartAt: data.occurrenceStartAt.toISOString(),
							programId: data.programId,
							sessionId: data.sessionId,
							timelineId: data.timelineId,
						},
						referenceId: `${data.programId}:${data.occurrenceStartAt.toISOString()}`,
						referenceType: PaymentReferenceType.CUSTOM,
						role: "reservation-checkout",
						serviceCode: "core",
					},
				],
			}));

		return {
			currency,
			lineItems: [
				{
					currency,
					label: subjectLabel,
					quantity: 1,
					totalAmount,
					unitAmount: totalAmount,
				},
			],
			nextAction: {
				redirectUrl: null,
				type: ReservationPaymentCheckoutNextActionType.PROVIDER_HANDOFF_PENDING,
			},
			payment,
			providerOrderId,
			status: payment.status,
			totalAmount,
		};
	}

	async updatePayment(
		paymentId: string,
		data: UpdatePaymentInput,
	): Promise<Payment> {
		const payment = await this.findPaymentDetails(paymentId);
		this.assertCanWriteSpace(payment.spaceId);

		const status = this.readEnumUpdate<PaymentStatus>(data.status);
		const approvedAt =
			status === PaymentStatus.PAID && !payment.approvedAt
				? new Date()
				: data.approvedAt;
		const canceledAt =
			status === PaymentStatus.CANCELED && !payment.canceledAt
				? new Date()
				: data.canceledAt;

		return this.repository.updateById(paymentId, {
			...data,
			approvedAt,
			canceledAt,
			metadata: this.toNullableJson(data.metadata),
		});
	}

	async deletePayment(paymentId: string): Promise<void> {
		const payment = await this.findPaymentDetails(paymentId);
		this.assertCanWriteSpace(payment.spaceId);
		await this.repository.removeById(paymentId);
	}

	private normalizeSubjects(
		subjects: NonNullable<CreatePaymentInput["subjects"]>,
		defaultCurrency: string,
	): CreatePaymentSubjectInput[] {
		return subjects.map((subject) => {
			const quantity = subject.quantity ?? 1;
			const unitAmount = subject.unitAmount ?? 0;
			const totalAmount = subject.totalAmount ?? quantity * unitAmount;
			const currency = subject.currency ?? defaultCurrency;

			if (quantity < 1 || unitAmount < 0 || totalAmount < 0) {
				throw new BadRequestException(PAYMENT_ERRORS.PAYMENT_AMOUNT_INVALID);
			}

			return {
				serviceCode: subject.serviceCode ?? "core",
				subjectType: subject.subjectType,
				subjectId: subject.subjectId,
				subjectLabel: subject.subjectLabel,
				quantity,
				unitAmount,
				totalAmount,
				currency,
				metadata: this.toNullableJson(subject.metadata),
			};
		});
	}

	private async assertReservationCheckoutNeedsPayment(
		data: CreateReservationPaymentCheckoutInput,
	): Promise<void> {
		const { items } = await this.getCoursesRepository().findManyCoursePasses({
			where: {
				expiresAt: { gte: data.occurrenceStartAt },
				reservationRemainingCount: { gt: 0 },
				status: CoursePassStatus.ACTIVE,
				timelineId: data.timelineId,
				userId: data.userId,
				validFrom: { lte: data.occurrenceStartAt },
				OR: [
					{ courseOffering: { spaceId: data.spaceId } },
					{ course: { spaceId: data.spaceId } },
				],
			},
			take: 1,
		});

		if (items.length > 0) {
			throw new ConflictException(
				PAYMENT_ERRORS.RESERVATION_CHECKOUT_ACTIVE_PASS_EXISTS,
			);
		}
	}

	private async findReservationCheckoutOffering(
		data: CreateReservationPaymentCheckoutInput,
	) {
		const { items } = await this.getCoursesRepository().findManyOfferings({
			where: {
				endsAt: { gte: data.occurrenceStartAt },
				spaceId: data.spaceId,
				startsAt: { lte: data.occurrenceStartAt },
				status: {
					in: [CourseOfferingStatus.ENROLLING, CourseOfferingStatus.ACTIVE],
				},
				timelineId: data.timelineId,
				course: {
					removedAt: null,
					status: CourseStatus.ACTIVE,
				},
			},
			orderBy: [{ startsAt: "desc" }],
			take: 1,
		});

		const offering = items[0];
		if (!offering) {
			throw new NotFoundException(
				PAYMENT_ERRORS.RESERVATION_CHECKOUT_OFFERING_NOT_FOUND,
			);
		}

		return offering;
	}

	private async assertReservationCheckoutProgramExists(
		data: CreateReservationPaymentCheckoutInput,
	): Promise<void> {
		const program = await this.getReservationsRepository().findBookingProgram({
			programId: data.programId,
			sessionId: data.sessionId,
			spaceId: data.spaceId,
			timelineId: data.timelineId,
		});

		if (!program) {
			throw new NotFoundException(
				PAYMENT_ERRORS.RESERVATION_CHECKOUT_PROGRAM_NOT_FOUND,
			);
		}
	}

	private async findExistingReservationCheckout(params: {
		provider: string;
		providerOrderId: string;
		spaceId: string;
		userId: string;
	}): Promise<Payment | null> {
		const result = await this.findPayments({
			payerUserId: params.userId,
			provider: params.provider,
			providerOrderId: params.providerOrderId,
			spaceId: params.spaceId,
			take: 1,
		});

		return result.payments[0] ?? null;
	}

	private buildReservationCheckoutOrderId(idempotencyKey: string): string {
		return `reservation:${idempotencyKey}`;
	}

	private getCoursesRepository(): CoursesRepository {
		if (!this.coursesRepository) {
			throw new Error("CoursesRepository provider is required");
		}
		return this.coursesRepository;
	}

	private getReservationsRepository(): ReservationsRepository {
		if (!this.reservationsRepository) {
			throw new Error("ReservationsRepository provider is required");
		}
		return this.reservationsRepository;
	}

	private normalizeReferences(
		references: NonNullable<CreatePaymentInput["references"]>,
	): CreatePaymentReferenceInput[] {
		return references.map((reference) => ({
			serviceCode: reference.serviceCode ?? "core",
			referenceType: reference.referenceType,
			referenceId: reference.referenceId,
			role: reference.role ?? "primary",
			label: reference.label,
			metadata: this.toNullableJson(reference.metadata),
		}));
	}

	private buildPaymentWhere(
		params: PaymentListInput,
		spaceIds?: string[],
	): Prisma.PaymentWhereInput {
		const where: Prisma.PaymentWhereInput = {
			...(spaceIds ? { spaceId: { in: spaceIds } } : {}),
			...(params.payerUserId ? { payerUserId: params.payerUserId } : {}),
			...(params.status ? { status: params.status } : {}),
			...(params.method ? { method: params.method } : {}),
			...(params.provider ? { provider: params.provider } : {}),
			...(params.providerOrderId
				? { providerOrderId: params.providerOrderId }
				: {}),
		};

		const and: Prisma.PaymentWhereInput[] = [];

		if (params.subjectType || params.subjectId) {
			and.push({
				subjects: {
					some: {
						removedAt: null,
						...(params.subjectType ? { subjectType: params.subjectType } : {}),
						...(params.subjectId ? { subjectId: params.subjectId } : {}),
					},
				},
			});
		}

		if (params.referenceType || params.referenceId) {
			and.push({
				references: {
					some: {
						removedAt: null,
						...(params.referenceType
							? { referenceType: params.referenceType }
							: {}),
						...(params.referenceId ? { referenceId: params.referenceId } : {}),
					},
				},
			});
		}

		if (params.approvedFrom || params.approvedUntil) {
			where.approvedAt = {
				...(params.approvedFrom ? { gte: params.approvedFrom } : {}),
				...(params.approvedUntil ? { lte: params.approvedUntil } : {}),
			};
		}

		if (params.search) {
			const search = { contains: params.search, mode: "insensitive" } as const;
			where.OR = [
				{ title: search },
				{ provider: search },
				{ providerPaymentId: search },
				{ providerOrderId: search },
				{ payer: { name: search } },
				{ payer: { email: search } },
				{ subjects: { some: { subjectLabel: search } } },
				{ subjects: { some: { subjectId: search } } },
				{ references: { some: { label: search } } },
				{ references: { some: { referenceId: search } } },
			];
		}

		if (and.length > 0) {
			where.AND = and;
		}

		return where;
	}

	private toPaymentOrderBy(
		sort?: string[],
	): Prisma.PaymentOrderByWithRelationInput[] | undefined {
		const orderBy = (sort ?? []).flatMap((item) => {
			const direction: "asc" | "desc" = item.startsWith("-") ? "desc" : "asc";
			const field = item.startsWith("-") ? item.slice(1) : item;
			return [
				"createdAt",
				"approvedAt",
				"totalAmount",
				"status",
				"title",
			].includes(field)
				? [{ [field]: direction }]
				: [];
		});

		return orderBy.length > 0
			? (orderBy as Prisma.PaymentOrderByWithRelationInput[])
			: undefined;
	}

	private resolveReadableSpaceIds(spaceId?: string): string[] | undefined {
		if (spaceId) {
			if (!this.spaceContext.canAccessSpace(spaceId)) {
				throw new ForbiddenException(PAYMENT_ERRORS.SPACE_ACCESS_REQUIRED);
			}
			return [spaceId];
		}

		return (
			this.spaceContext.spaceIds ??
			(this.spaceContext.spaceId ? [this.spaceContext.spaceId] : undefined)
		);
	}

	private resolveWritableSpaceId(spaceId?: string): string {
		const targetSpaceId = spaceId ?? this.spaceContext.spaceId;
		if (!targetSpaceId) {
			throw new BadRequestException(PAYMENT_ERRORS.SPACE_NOT_SELECTED);
		}
		this.assertCanWriteSpace(targetSpaceId);
		return targetSpaceId;
	}

	private assertCanWriteSpace(spaceId: string): void {
		const currentSpaceId = this.spaceContext.spaceId;
		if (currentSpaceId && currentSpaceId !== spaceId) {
			throw new ForbiddenException(PAYMENT_ERRORS.SPACE_ACCESS_REQUIRED);
		}
		if (!this.spaceContext.canAccessSpace(spaceId)) {
			throw new ForbiddenException(PAYMENT_ERRORS.SPACE_ACCESS_REQUIRED);
		}
	}

	private assertCanReadSpace(spaceId: string): void {
		if (!this.spaceContext.canAccessSpace(spaceId)) {
			throw new NotFoundException(PAYMENT_ERRORS.PAYMENT_NOT_FOUND);
		}
	}

	private toNullableJson(
		value: Prisma.InputJsonValue | null | undefined,
	): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
		if (value === undefined) {
			return undefined;
		}

		return value === null ? Prisma.JsonNull : value;
	}

	private readEnumUpdate<TValue>(value: unknown): TValue | undefined {
		if (typeof value === "object" && value !== null && "set" in value) {
			return (value as { set?: TValue }).set;
		}

		return value as TValue | undefined;
	}
}
