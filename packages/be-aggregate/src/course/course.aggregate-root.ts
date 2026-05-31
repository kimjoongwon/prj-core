import { COURSE_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import type {
	Course,
	CourseOffering,
	CoursePass,
	Enrollment,
} from "@cocrepo/entity";
import {
	CourseOfferingStatus,
	CoursePassKind,
	CoursePassStatus,
	EnrollmentStatus,
	PaymentStatus,
	type Prisma,
} from "@cocrepo/prisma";
import {
	CoursesRepository,
	PaymentsRepository,
	TimelinesRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import type { CourseListInput } from "./course-list.input";
import type { CourseOfferingListInput } from "./course-offering-list.input";
import type { CoursePassListInput } from "./course-pass-list.input";
import type { CreateEnrollmentInput } from "./create-enrollment.input";
import type { EnrollmentListInput } from "./enrollment-list.input";

@Injectable()
export class CourseAggregateRoot {
	private readonly logger = new Logger(CourseAggregateRoot.name);

	constructor(
		private readonly repository: CoursesRepository,
		private readonly timelinesRepository: TimelinesRepository,
		private readonly spaceContext: SpaceContext,
		private readonly paymentsRepository?: PaymentsRepository,
	) {}

	async findCourses(
		params: CourseListInput = {},
	): Promise<{ courses: Course[]; total: number }> {
		const spaceIds = this.resolveReadableSpaceIds(params.spaceId);
		this.logger.debug(
			`코스 목록 조회: spaceIds=${spaceIds?.length ?? "all"}개`,
		);

		const result = await this.repository.findMany({
			where: this.buildCourseWhere(params, spaceIds),
			orderBy: this.toCourseOrderBy(params.sort),
			skip: params.skip,
			take: params.take,
		});

		return { courses: result.items, total: result.totalCount };
	}

	async findCourseOfferings(
		params: CourseOfferingListInput = {},
	): Promise<{ courseOfferings: CourseOffering[]; total: number }> {
		const spaceIds = this.resolveReadableSpaceIds(params.spaceId);
		const result = await this.repository.findManyOfferings({
			where: this.buildCourseOfferingWhere(params, spaceIds),
			orderBy: this.toCourseOfferingOrderBy(params.sort),
			skip: params.skip,
			take: params.take,
		});

		return { courseOfferings: result.items, total: result.totalCount };
	}

	async findEnrollments(
		params: EnrollmentListInput = {},
	): Promise<{ enrollments: Enrollment[]; total: number }> {
		const result = await this.repository.findManyEnrollments({
			where: this.buildEnrollmentWhere(params, this.resolveReadableSpaceIds()),
			orderBy: this.toEnrollmentOrderBy(params.sort),
			skip: params.skip,
			take: params.take,
		});

		return { enrollments: result.items, total: result.totalCount };
	}

	async findEnrollmentDetails(enrollmentId: string): Promise<Enrollment> {
		const enrollment = await this.repository.findEnrollmentById(enrollmentId);
		if (!enrollment) {
			throw new NotFoundException(COURSE_ERRORS.ENROLLMENT_NOT_FOUND);
		}
		this.assertCanReadSpace(this.resolveEnrollmentSpaceId(enrollment));
		return enrollment;
	}

	@Transactional()
	async createEnrollment(data: CreateEnrollmentInput): Promise<Enrollment> {
		await this.assertEnrollmentScope(data);

		const enrollment = await this.repository.createEnrollment(data);
		await this.issueCoursePassIfReady(enrollment.id);

		return this.findEnrollmentDetails(enrollment.id);
	}

	async findCoursePasses(
		params: CoursePassListInput = {},
	): Promise<{ coursePasses: CoursePass[]; total: number }> {
		const result = await this.repository.findManyCoursePasses({
			where: this.buildCoursePassWhere(params, this.resolveReadableSpaceIds()),
			orderBy: this.toCoursePassOrderBy(params.sort),
			skip: params.skip,
			take: params.take,
		});

		return { coursePasses: result.items, total: result.totalCount };
	}

	private async issueCoursePassIfReady(
		enrollmentId: string,
	): Promise<CoursePass | null> {
		const enrollment = await this.findEnrollmentDetails(enrollmentId);
		if (!enrollment.canIssueCoursePass()) {
			return enrollment.coursePass ?? null;
		}

		const course = enrollment.course;
		const courseOffering = enrollment.courseOffering;
		if (!course || !courseOffering) {
			throw new BadRequestException(COURSE_ERRORS.ENROLLMENT_SCOPE_INVALID);
		}

		const timelineId =
			enrollment.assignedTimelineId ?? courseOffering.timelineId ?? null;
		if (!timelineId) {
			throw new BadRequestException(
				COURSE_ERRORS.ENROLLMENT_PASS_TIMELINE_REQUIRED,
			);
		}

		await this.assertTimelineBelongsToSpace(timelineId, courseOffering.spaceId);

		const validFrom = enrollment.validFrom ?? enrollment.paidAt ?? new Date();
		const expiresAt =
			enrollment.validUntil ??
			this.addMonths(validFrom, Math.max(course.durationMonths, 1));
		// Default to a weekly reservation allowance for the full course duration.
		const reservationLimit = Math.max(course.durationMonths, 1) * 4;

		return this.repository.createCoursePass({
			enrollmentId: enrollment.id,
			userId: enrollment.userId,
			courseId: enrollment.courseId,
			courseOfferingId: enrollment.courseOfferingId,
			timelineId,
			kind: CoursePassKind.STANDARD,
			issuedAt: new Date(),
			validFrom,
			expiresAt,
			reservationLimit,
			reservationUsedCount: 0,
			reservationRemainingCount: reservationLimit,
			status: CoursePassStatus.ACTIVE,
		});
	}

	private async assertEnrollmentScope(
		data: CreateEnrollmentInput,
	): Promise<void> {
		const offering = await this.repository.findOfferingById(
			data.courseOfferingId,
		);
		if (!offering) {
			throw new NotFoundException(COURSE_ERRORS.COURSE_OFFERING_NOT_FOUND);
		}
		this.assertCanWriteSpace(offering.spaceId);

		if (offering.courseId !== data.courseId) {
			throw new BadRequestException(COURSE_ERRORS.ENROLLMENT_SCOPE_INVALID);
		}

		if (offering.isFull()) {
			throw new BadRequestException(
				COURSE_ERRORS.COURSE_OFFERING_CAPACITY_EXCEEDED,
			);
		}

		if (data.assignedTimelineId) {
			await this.assertTimelineBelongsToSpace(
				data.assignedTimelineId,
				offering.spaceId,
			);
		}

		if (data.paymentId) {
			await this.assertPaymentBelongsToSpace(data.paymentId, offering.spaceId);
		}

		const status = data.status ?? EnrollmentStatus.PENDING;
		const paymentStatus = data.paymentStatus ?? PaymentStatus.PENDING;
		if (
			status === EnrollmentStatus.ACTIVE &&
			paymentStatus === PaymentStatus.PAID &&
			!data.assignedTimelineId &&
			!offering.timelineId
		) {
			throw new BadRequestException(
				COURSE_ERRORS.ENROLLMENT_PASS_TIMELINE_REQUIRED,
			);
		}
	}

	private async assertTimelineBelongsToSpace(
		timelineId: string | null | undefined,
		spaceId: string,
	): Promise<void> {
		if (!timelineId) {
			return;
		}

		const timeline = await this.timelinesRepository.findTimelineById(
			timelineId,
			[spaceId],
		);
		if (!timeline) {
			throw new BadRequestException(
				COURSE_ERRORS.COURSE_OFFERING_SCOPE_INVALID,
			);
		}
	}

	private async assertPaymentBelongsToSpace(
		paymentId: string,
		spaceId: string,
	): Promise<void> {
		if (!this.paymentsRepository) {
			return;
		}

		const payment = await this.paymentsRepository.findById(paymentId);
		if (!payment || payment.spaceId !== spaceId) {
			throw new BadRequestException(COURSE_ERRORS.ENROLLMENT_SCOPE_INVALID);
		}
	}

	private buildCourseWhere(
		params: CourseListInput,
		spaceIds?: string[],
	): Prisma.CourseWhereInput {
		const where: Prisma.CourseWhereInput = {
			...(spaceIds ? { spaceId: { in: spaceIds } } : {}),
			...(params.status ? { status: params.status } : {}),
		};

		if (params.search) {
			const search = { contains: params.search, mode: "insensitive" } as const;
			where.OR = [{ name: search }, { description: search }];
		}

		return where;
	}

	private buildCourseOfferingWhere(
		params: CourseOfferingListInput,
		spaceIds?: string[],
	): Prisma.CourseOfferingWhereInput {
		const where: Prisma.CourseOfferingWhereInput = {
			...(spaceIds ? { spaceId: { in: spaceIds } } : {}),
			...(params.courseId ? { courseId: params.courseId } : {}),
			...(params.timelineId ? { timelineId: params.timelineId } : {}),
			...(params.status ? { status: params.status } : {}),
			...(params.timelineProvisioningMode
				? { timelineProvisioningMode: params.timelineProvisioningMode }
				: {}),
		};

		if (params.search) {
			const search = { contains: params.search, mode: "insensitive" } as const;
			where.OR = [
				{ name: search },
				{ course: { name: search } },
				{ timeline: { is: { name: search } } },
			];
		}

		if (params.recruitingOnly) {
			const now = new Date();
			where.AND = [
				...(Array.isArray(where.AND)
					? where.AND
					: where.AND
						? [where.AND]
						: []),
				{ status: CourseOfferingStatus.ENROLLING },
				{
					OR: [
						{ enrollmentStartsAt: null },
						{ enrollmentStartsAt: { lte: now } },
					],
				},
				{
					OR: [{ enrollmentEndsAt: null }, { enrollmentEndsAt: { gte: now } }],
				},
			];
		}

		return where;
	}

	private buildEnrollmentWhere(
		params: EnrollmentListInput,
		spaceIds?: string[],
	): Prisma.EnrollmentWhereInput {
		const where: Prisma.EnrollmentWhereInput = {
			...(spaceIds ? { courseOffering: { spaceId: { in: spaceIds } } } : {}),
			...(params.courseId ? { courseId: params.courseId } : {}),
			...(params.courseOfferingId
				? { courseOfferingId: params.courseOfferingId }
				: {}),
			...(params.userId ? { userId: params.userId } : {}),
			...(params.timelineId ? { assignedTimelineId: params.timelineId } : {}),
			...(params.paymentId ? { paymentId: params.paymentId } : {}),
			...(params.paymentStatus ? { paymentStatus: params.paymentStatus } : {}),
			...(params.status ? { status: params.status } : {}),
		};

		if (params.validOn) {
			where.validFrom = { lte: params.validOn };
			where.validUntil = { gte: params.validOn };
		}

		if (params.search) {
			const search = { contains: params.search, mode: "insensitive" } as const;
			where.OR = [
				{ user: { name: search } },
				{ user: { email: search } },
				{ course: { name: search } },
				{ courseOffering: { name: search } },
				{ payment: { is: { title: search } } },
				{ payment: { is: { providerPaymentId: search } } },
				{ paymentProvider: search },
				{ paymentExternalId: search },
			];
		}

		return where;
	}

	private buildCoursePassWhere(
		params: CoursePassListInput,
		spaceIds?: string[],
	): Prisma.CoursePassWhereInput {
		const where: Prisma.CoursePassWhereInput = {
			...(spaceIds ? { courseOffering: { spaceId: { in: spaceIds } } } : {}),
			...(params.courseId ? { courseId: params.courseId } : {}),
			...(params.courseOfferingId
				? { courseOfferingId: params.courseOfferingId }
				: {}),
			...(params.enrollmentId ? { enrollmentId: params.enrollmentId } : {}),
			...(params.userId ? { userId: params.userId } : {}),
			...(params.timelineId ? { timelineId: params.timelineId } : {}),
			...(params.status ? { status: params.status } : {}),
			...(params.kind ? { kind: params.kind } : {}),
		};

		if (params.validOn) {
			where.validFrom = { lte: params.validOn };
			where.expiresAt = { gte: params.validOn };
		}

		if (params.expiresBefore) {
			where.expiresAt = {
				...(typeof where.expiresAt === "object" && where.expiresAt !== null
					? where.expiresAt
					: {}),
				lte: params.expiresBefore,
			};
		}

		if (params.search) {
			const search = { contains: params.search, mode: "insensitive" } as const;
			where.OR = [
				{ user: { name: search } },
				{ user: { email: search } },
				{ course: { name: search } },
				{ courseOffering: { name: search } },
				{ timeline: { name: search } },
			];
		}

		return where;
	}

	private toCourseOrderBy(
		sort?: string[],
	): Prisma.CourseOrderByWithRelationInput[] | undefined {
		return this.toOrderBy(sort, [
			"createdAt",
			"name",
			"status",
			"activeOfferingCount",
			"activeEnrollmentCount",
		]) as Prisma.CourseOrderByWithRelationInput[] | undefined;
	}

	private toCourseOfferingOrderBy(
		sort?: string[],
	): Prisma.CourseOfferingOrderByWithRelationInput[] | undefined {
		return this.toOrderBy(sort, [
			"createdAt",
			"name",
			"startsAt",
			"endsAt",
			"enrollmentStartsAt",
			"enrollmentEndsAt",
			"capacity",
			"enrolledCount",
			"status",
		]) as Prisma.CourseOfferingOrderByWithRelationInput[] | undefined;
	}

	private toEnrollmentOrderBy(
		sort?: string[],
	): Prisma.EnrollmentOrderByWithRelationInput[] | undefined {
		return this.toOrderBy(sort, [
			"createdAt",
			"paidAt",
			"validFrom",
			"validUntil",
			"paymentStatus",
			"status",
		]) as Prisma.EnrollmentOrderByWithRelationInput[] | undefined;
	}

	private toCoursePassOrderBy(
		sort?: string[],
	): Prisma.CoursePassOrderByWithRelationInput[] | undefined {
		return this.toOrderBy(sort, [
			"createdAt",
			"issuedAt",
			"validFrom",
			"expiresAt",
			"reservationRemainingCount",
			"status",
		]) as Prisma.CoursePassOrderByWithRelationInput[] | undefined;
	}

	private toOrderBy(
		sort: string[] | undefined,
		allowedFields: readonly string[],
	): Array<Record<string, "asc" | "desc">> | undefined {
		const orderBy = (sort ?? []).flatMap((item) => {
			const direction: "asc" | "desc" = item.startsWith("-") ? "desc" : "asc";
			const field = item.startsWith("-") ? item.slice(1) : item;
			return allowedFields.includes(field) ? [{ [field]: direction }] : [];
		});

		return orderBy.length > 0 ? orderBy : undefined;
	}

	private resolveReadableSpaceIds(spaceId?: string): string[] | undefined {
		if (spaceId) {
			if (!this.spaceContext.canAccessSpace(spaceId)) {
				throw new ForbiddenException(COURSE_ERRORS.SPACE_ACCESS_REQUIRED);
			}
			return [spaceId];
		}

		return (
			this.spaceContext.spaceIds ??
			(this.spaceContext.spaceId ? [this.spaceContext.spaceId] : undefined)
		);
	}

	private assertCanWriteSpace(spaceId: string): void {
		const currentSpaceId = this.spaceContext.spaceId;
		if (currentSpaceId && currentSpaceId !== spaceId) {
			throw new ForbiddenException(COURSE_ERRORS.SPACE_ACCESS_REQUIRED);
		}
		if (!this.spaceContext.canAccessSpace(spaceId)) {
			throw new ForbiddenException(COURSE_ERRORS.SPACE_ACCESS_REQUIRED);
		}
	}

	private assertCanReadSpace(spaceId: string): void {
		if (!this.spaceContext.canAccessSpace(spaceId)) {
			throw new NotFoundException(COURSE_ERRORS.COURSE_NOT_FOUND);
		}
	}

	private resolveEnrollmentSpaceId(enrollment: Enrollment): string {
		const spaceId =
			enrollment.courseOffering?.spaceId ?? enrollment.course?.spaceId;
		if (!spaceId) {
			throw new BadRequestException(COURSE_ERRORS.ENROLLMENT_SCOPE_INVALID);
		}
		return spaceId;
	}

	private addMonths(date: Date, months: number): Date {
		const result = new Date(date);
		result.setUTCMonth(result.getUTCMonth() + months);
		return result;
	}
}
