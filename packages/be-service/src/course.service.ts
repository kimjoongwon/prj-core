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
	CourseStatus,
	EnrollmentStatus,
	PaymentStatus,
	type Prisma,
	TimelineProvisioningMode,
} from "@cocrepo/prisma";
import { CoursesRepository, TimelinesRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

export interface CourseListInput {
	skip?: number;
	take?: number;
	search?: string | null;
	status?: CourseStatus;
	spaceId?: string;
	sort?: string[];
}

export interface CourseOfferingListInput {
	skip?: number;
	take?: number;
	search?: string | null;
	courseId?: string;
	spaceId?: string;
	timelineId?: string;
	status?: CourseOfferingStatus;
	timelineProvisioningMode?: TimelineProvisioningMode;
	recruitingOnly?: boolean;
	sort?: string[];
}

export interface EnrollmentListInput {
	skip?: number;
	take?: number;
	search?: string | null;
	courseId?: string;
	courseOfferingId?: string;
	userId?: string;
	timelineId?: string;
	paymentStatus?: PaymentStatus;
	status?: EnrollmentStatus;
	validOn?: Date;
	sort?: string[];
}

export interface CoursePassListInput {
	skip?: number;
	take?: number;
	search?: string | null;
	courseId?: string;
	courseOfferingId?: string;
	enrollmentId?: string;
	userId?: string;
	timelineId?: string;
	status?: CoursePassStatus;
	kind?: CoursePassKind;
	validOn?: Date;
	expiresBefore?: Date;
	sort?: string[];
}

type CreateCourseInput = Prisma.CourseUncheckedCreateInput;
type UpdateCourseInput = Omit<Prisma.CourseUncheckedUpdateInput, "spaceId">;
type CreateCourseOfferingInput = Prisma.CourseOfferingUncheckedCreateInput;
type UpdateCourseOfferingInput = Omit<
	Prisma.CourseOfferingUncheckedUpdateInput,
	"courseId" | "spaceId"
>;
type CreateEnrollmentInput = Prisma.EnrollmentUncheckedCreateInput;
type UpdateEnrollmentInput = Omit<
	Prisma.EnrollmentUncheckedUpdateInput,
	"userId" | "courseId" | "courseOfferingId"
>;
type UpdateCoursePassInput = Prisma.CoursePassUncheckedUpdateInput;

@Injectable()
export class CourseService {
	private readonly logger = new Logger(CourseService.name);

	constructor(
		private readonly repository: CoursesRepository,
		private readonly timelinesRepository: TimelinesRepository,
		private readonly spaceContext: SpaceContext,
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

	async findCourseDetails(courseId: string): Promise<Course> {
		const course = await this.repository.findByIdWithRelations(courseId);
		if (!course) {
			throw new NotFoundException(COURSE_ERRORS.COURSE_NOT_FOUND);
		}
		this.assertCanReadSpace(course.spaceId);
		return course;
	}

	async createCourse(data: CreateCourseInput): Promise<Course> {
		const spaceId = this.resolveWritableSpaceId(data.spaceId);
		return this.repository.create({
			...data,
			spaceId,
		});
	}

	async updateCourse(
		courseId: string,
		data: UpdateCourseInput,
	): Promise<Course> {
		const course = await this.findCourseDetails(courseId);
		this.assertCanWriteSpace(course.spaceId);

		return this.repository.updateById(courseId, data);
	}

	async deleteCourse(courseId: string): Promise<void> {
		const course = await this.findCourseDetails(courseId);
		this.assertCanWriteSpace(course.spaceId);

		if (course.hasActiveEnrollments()) {
			throw new BadRequestException(
				COURSE_ERRORS.COURSE_HAS_ACTIVE_ENROLLMENTS,
			);
		}

		await this.repository.removeById(courseId);
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

	async findCourseOfferingDetails(
		courseOfferingId: string,
	): Promise<CourseOffering> {
		const courseOffering =
			await this.repository.findOfferingById(courseOfferingId);
		if (!courseOffering) {
			throw new NotFoundException(COURSE_ERRORS.COURSE_OFFERING_NOT_FOUND);
		}
		this.assertCanReadSpace(courseOffering.spaceId);
		return courseOffering;
	}

	async createCourseOffering(
		data: CreateCourseOfferingInput,
	): Promise<CourseOffering> {
		this.assertDateRange(data.startsAt, data.endsAt);
		this.assertDateRange(data.enrollmentStartsAt, data.enrollmentEndsAt);

		const spaceId = this.resolveWritableSpaceId(data.spaceId);
		await this.assertCourseOfferingScope({
			courseId: data.courseId,
			spaceId,
			timelineId: data.timelineId ?? null,
		});

		return this.repository.createOffering({
			...data,
			spaceId,
		});
	}

	async updateCourseOffering(
		courseOfferingId: string,
		data: UpdateCourseOfferingInput,
	): Promise<CourseOffering> {
		const courseOffering =
			await this.findCourseOfferingDetails(courseOfferingId);
		this.assertCanWriteSpace(courseOffering.spaceId);

		const startsAt =
			this.readDateUpdate(data.startsAt) ?? courseOffering.startsAt;
		const endsAt = this.readDateUpdate(data.endsAt) ?? courseOffering.endsAt;
		const enrollmentStartsAt =
			this.readNullableDateUpdate(data.enrollmentStartsAt) ??
			courseOffering.enrollmentStartsAt;
		const enrollmentEndsAt =
			this.readNullableDateUpdate(data.enrollmentEndsAt) ??
			courseOffering.enrollmentEndsAt;
		this.assertDateRange(startsAt, endsAt);
		this.assertDateRange(enrollmentStartsAt, enrollmentEndsAt);

		const timelineId = this.readNullableStringUpdate(data.timelineId);
		if (timelineId !== undefined) {
			await this.assertTimelineBelongsToSpace(
				timelineId,
				courseOffering.spaceId,
			);
		}

		return this.repository.updateOfferingById(courseOfferingId, data);
	}

	async deleteCourseOffering(courseOfferingId: string): Promise<void> {
		const courseOffering =
			await this.findCourseOfferingDetails(courseOfferingId);
		this.assertCanWriteSpace(courseOffering.spaceId);

		if (
			courseOffering.enrollments?.some((enrollment) => enrollment.isActive()) ||
			courseOffering.passes?.some((coursePass) => coursePass.isActive())
		) {
			throw new BadRequestException(
				COURSE_ERRORS.COURSE_HAS_ACTIVE_ENROLLMENTS,
			);
		}

		await this.repository.removeOfferingById(courseOfferingId);
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

	@Transactional()
	async updateEnrollment(
		enrollmentId: string,
		data: UpdateEnrollmentInput,
	): Promise<Enrollment> {
		const enrollment = await this.findEnrollmentDetails(enrollmentId);
		const offeringSpaceId = this.resolveEnrollmentSpaceId(enrollment);
		this.assertCanWriteSpace(offeringSpaceId);

		const assignedTimelineId = this.readNullableStringUpdate(
			data.assignedTimelineId,
		);
		if (assignedTimelineId !== undefined) {
			await this.assertTimelineBelongsToSpace(
				assignedTimelineId,
				offeringSpaceId,
			);
		}

		await this.repository.updateEnrollmentById(enrollmentId, data);
		await this.issueCoursePassIfReady(enrollmentId);

		return this.findEnrollmentDetails(enrollmentId);
	}

	async deleteEnrollment(enrollmentId: string): Promise<void> {
		const enrollment = await this.findEnrollmentDetails(enrollmentId);
		const offeringSpaceId = this.resolveEnrollmentSpaceId(enrollment);
		this.assertCanWriteSpace(offeringSpaceId);

		await this.repository.removeEnrollmentById(enrollmentId);
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

	async findCoursePassDetails(coursePassId: string): Promise<CoursePass> {
		const coursePass = await this.repository.findCoursePassById(coursePassId);
		if (!coursePass) {
			throw new NotFoundException(COURSE_ERRORS.COURSE_PASS_NOT_FOUND);
		}
		this.assertCanReadSpace(this.resolveCoursePassSpaceId(coursePass));
		return coursePass;
	}

	async updateCoursePass(
		coursePassId: string,
		data: UpdateCoursePassInput,
	): Promise<CoursePass> {
		const coursePass = await this.findCoursePassDetails(coursePassId);
		this.assertCanWriteSpace(this.resolveCoursePassSpaceId(coursePass));

		return this.repository.updateCoursePassById(coursePassId, data);
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

	private async assertCourseOfferingScope(params: {
		courseId: string;
		spaceId: string;
		timelineId?: string | null;
	}): Promise<void> {
		const course = await this.repository.findById(params.courseId);
		if (!course) {
			throw new NotFoundException(COURSE_ERRORS.COURSE_NOT_FOUND);
		}
		if (course.spaceId !== params.spaceId) {
			throw new BadRequestException(
				COURSE_ERRORS.COURSE_OFFERING_SCOPE_INVALID,
			);
		}
		await this.assertTimelineBelongsToSpace(params.timelineId, params.spaceId);
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

	private assertDateRange(
		startsAt: Date | string | null | undefined,
		endsAt: Date | string | null | undefined,
	): void {
		if (!startsAt || !endsAt) {
			return;
		}

		if (this.toDate(endsAt) <= this.toDate(startsAt)) {
			throw new BadRequestException(COURSE_ERRORS.COURSE_OFFERING_DATE_INVALID);
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

	private resolveWritableSpaceId(spaceId?: string): string {
		const targetSpaceId = spaceId ?? this.spaceContext.spaceId;
		if (!targetSpaceId) {
			throw new BadRequestException(COURSE_ERRORS.SPACE_NOT_SELECTED);
		}
		this.assertCanWriteSpace(targetSpaceId);
		return targetSpaceId;
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

	private resolveCoursePassSpaceId(coursePass: CoursePass): string {
		const spaceId =
			coursePass.courseOffering?.spaceId ?? coursePass.course?.spaceId;
		if (!spaceId) {
			throw new BadRequestException(COURSE_ERRORS.COURSE_PASS_SPACE_MISMATCH);
		}
		return spaceId;
	}

	private readNullableStringUpdate(
		value:
			| string
			| null
			| Prisma.NullableStringFieldUpdateOperationsInput
			| undefined,
	): string | null | undefined {
		if (value === undefined || value === null || typeof value === "string") {
			return value as string | null | undefined;
		}
		return value.set as string | null | undefined;
	}

	private readDateUpdate(
		value:
			| Date
			| string
			| Prisma.DateTimeFieldUpdateOperationsInput
			| undefined,
	): Date | string | undefined {
		if (
			value === undefined ||
			value instanceof Date ||
			typeof value === "string"
		) {
			return value as Date | string | undefined;
		}
		return value.set as Date | string | undefined;
	}

	private readNullableDateUpdate(
		value:
			| Date
			| string
			| null
			| Prisma.NullableDateTimeFieldUpdateOperationsInput
			| undefined,
	): Date | string | null | undefined {
		if (
			value === undefined ||
			value === null ||
			value instanceof Date ||
			typeof value === "string"
		) {
			return value as Date | string | null | undefined;
		}
		return value.set as Date | string | null | undefined;
	}

	private toDate(value: Date | string): Date {
		return value instanceof Date ? value : new Date(value);
	}

	private addMonths(date: Date, months: number): Date {
		const result = new Date(date);
		result.setUTCMonth(result.getUTCMonth() + months);
		return result;
	}
}
