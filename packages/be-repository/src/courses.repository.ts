import {
	Course,
	CourseOffering,
	CoursePass,
	Enrollment,
} from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

const courseInclude = {
	space: true,
} satisfies Prisma.CourseInclude;

const courseOfferingInclude = {
	course: true,
	space: true,
	timeline: true,
} satisfies Prisma.CourseOfferingInclude;

const enrollmentInclude = {
	user: true,
	course: true,
	courseOffering: {
		include: {
			space: true,
			timeline: true,
		},
	},
	assignedTimeline: true,
	coursePass: true,
	payment: true,
} satisfies Prisma.EnrollmentInclude;

const coursePassInclude = {
	enrollment: {
		include: {
			user: true,
			course: true,
			courseOffering: {
				include: {
					space: true,
					timeline: true,
				},
			},
			assignedTimeline: true,
		},
	},
	user: true,
	course: true,
	courseOffering: {
		include: {
			space: true,
			timeline: true,
		},
	},
	timeline: true,
} satisfies Prisma.CoursePassInclude;

const courseDetailInclude = {
	space: true,
	offerings: {
		where: { removedAt: null },
		include: courseOfferingInclude,
		orderBy: { startsAt: "desc" },
	},
	enrollments: {
		where: { removedAt: null },
		include: enrollmentInclude,
		orderBy: { createdAt: "desc" },
	},
	passes: {
		where: { removedAt: null },
		include: coursePassInclude,
		orderBy: { createdAt: "desc" },
	},
} satisfies Prisma.CourseInclude;

const courseOfferingDetailInclude = {
	...courseOfferingInclude,
	enrollments: {
		where: { removedAt: null },
		include: enrollmentInclude,
		orderBy: { createdAt: "desc" },
	},
	passes: {
		where: { removedAt: null },
		include: coursePassInclude,
		orderBy: { createdAt: "desc" },
	},
} satisfies Prisma.CourseOfferingInclude;

@Injectable()
export class CoursesRepository {
	private readonly logger = new Logger(CoursesRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findMany(params?: {
		where?: Prisma.CourseWhereInput;
		orderBy?: Prisma.CourseOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Course[]; totalCount: number }> {
		this.logger.debug("Course 목록 조회");

		const where: Prisma.CourseWhereInput = {
			...(params?.where ?? {}),
			removedAt: null,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.course.findMany({
				where,
				include: courseInclude,
				orderBy: params?.orderBy ?? [{ createdAt: "desc" }],
				skip: params?.skip,
				take: params?.take,
			}),
			this.txHost.tx.course.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(Course, item)),
			totalCount,
		};
	}

	async findById(id: string): Promise<Course | null> {
		this.logger.debug(`Course 단건 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.course.findFirst({
			where: { id, removedAt: null },
			include: courseInclude,
		});

		return result ? plainToInstance(Course, result) : null;
	}

	async findByIdWithRelations(id: string): Promise<Course | null> {
		this.logger.debug(`Course 관계 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.course.findFirst({
			where: { id, removedAt: null },
			include: courseDetailInclude,
		});

		return result ? plainToInstance(Course, result) : null;
	}

	async create(data: Prisma.CourseUncheckedCreateInput): Promise<Course> {
		this.logger.debug("Course 생성");

		const result = await this.txHost.tx.course.create({
			data,
			include: courseInclude,
		});

		return plainToInstance(Course, result);
	}

	async updateById(
		id: string,
		data: Prisma.CourseUncheckedUpdateInput,
	): Promise<Course> {
		this.logger.debug(`Course 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.course.update({
			where: { id },
			data,
			include: courseInclude,
		});

		return plainToInstance(Course, result);
	}

	async removeById(id: string): Promise<Course> {
		this.logger.debug(`Course 소프트 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.course.update({
			where: { id },
			data: { removedAt: new Date() },
			include: courseInclude,
		});

		return plainToInstance(Course, result);
	}

	async findManyOfferings(params?: {
		where?: Prisma.CourseOfferingWhereInput;
		orderBy?: Prisma.CourseOfferingOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: CourseOffering[]; totalCount: number }> {
		this.logger.debug("CourseOffering 목록 조회");

		const where: Prisma.CourseOfferingWhereInput = {
			...(params?.where ?? {}),
			removedAt: null,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.courseOffering.findMany({
				where,
				include: courseOfferingInclude,
				orderBy: params?.orderBy ?? [{ createdAt: "desc" }],
				skip: params?.skip,
				take: params?.take,
			}),
			this.txHost.tx.courseOffering.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(CourseOffering, item)),
			totalCount,
		};
	}

	async findOfferingById(id: string): Promise<CourseOffering | null> {
		this.logger.debug(`CourseOffering 단건 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.courseOffering.findFirst({
			where: { id, removedAt: null },
			include: courseOfferingDetailInclude,
		});

		return result ? plainToInstance(CourseOffering, result) : null;
	}

	async createOffering(
		data: Prisma.CourseOfferingUncheckedCreateInput,
	): Promise<CourseOffering> {
		this.logger.debug("CourseOffering 생성");

		const result = await this.txHost.tx.courseOffering.create({
			data,
			include: courseOfferingInclude,
		});

		return plainToInstance(CourseOffering, result);
	}

	async updateOfferingById(
		id: string,
		data: Prisma.CourseOfferingUncheckedUpdateInput,
	): Promise<CourseOffering> {
		this.logger.debug(`CourseOffering 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.courseOffering.update({
			where: { id },
			data,
			include: courseOfferingInclude,
		});

		return plainToInstance(CourseOffering, result);
	}

	async removeOfferingById(id: string): Promise<CourseOffering> {
		this.logger.debug(`CourseOffering 소프트 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.courseOffering.update({
			where: { id },
			data: { removedAt: new Date() },
			include: courseOfferingInclude,
		});

		return plainToInstance(CourseOffering, result);
	}

	async findManyEnrollments(params?: {
		where?: Prisma.EnrollmentWhereInput;
		orderBy?: Prisma.EnrollmentOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Enrollment[]; totalCount: number }> {
		this.logger.debug("Enrollment 목록 조회");

		const where: Prisma.EnrollmentWhereInput = {
			...(params?.where ?? {}),
			removedAt: null,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.enrollment.findMany({
				where,
				include: enrollmentInclude,
				orderBy: params?.orderBy ?? [{ createdAt: "desc" }],
				skip: params?.skip,
				take: params?.take,
			}),
			this.txHost.tx.enrollment.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(Enrollment, item)),
			totalCount,
		};
	}

	async findEnrollmentById(id: string): Promise<Enrollment | null> {
		this.logger.debug(`Enrollment 단건 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.enrollment.findFirst({
			where: { id, removedAt: null },
			include: enrollmentInclude,
		});

		return result ? plainToInstance(Enrollment, result) : null;
	}

	async createEnrollment(
		data: Prisma.EnrollmentUncheckedCreateInput,
	): Promise<Enrollment> {
		this.logger.debug("Enrollment 생성");

		const result = await this.txHost.tx.enrollment.create({
			data,
			include: enrollmentInclude,
		});

		return plainToInstance(Enrollment, result);
	}

	async updateEnrollmentById(
		id: string,
		data: Prisma.EnrollmentUncheckedUpdateInput,
	): Promise<Enrollment> {
		this.logger.debug(`Enrollment 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.enrollment.update({
			where: { id },
			data,
			include: enrollmentInclude,
		});

		return plainToInstance(Enrollment, result);
	}

	async removeEnrollmentById(id: string): Promise<Enrollment> {
		this.logger.debug(`Enrollment 소프트 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.enrollment.update({
			where: { id },
			data: { removedAt: new Date() },
			include: enrollmentInclude,
		});

		return plainToInstance(Enrollment, result);
	}

	async findManyCoursePasses(params?: {
		where?: Prisma.CoursePassWhereInput;
		orderBy?: Prisma.CoursePassOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: CoursePass[]; totalCount: number }> {
		this.logger.debug("CoursePass 목록 조회");

		const where: Prisma.CoursePassWhereInput = {
			...(params?.where ?? {}),
			removedAt: null,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.coursePass.findMany({
				where,
				include: coursePassInclude,
				orderBy: params?.orderBy ?? [{ createdAt: "desc" }],
				skip: params?.skip,
				take: params?.take,
			}),
			this.txHost.tx.coursePass.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(CoursePass, item)),
			totalCount,
		};
	}

	async findCoursePassById(id: string): Promise<CoursePass | null> {
		this.logger.debug(`CoursePass 단건 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.coursePass.findFirst({
			where: { id, removedAt: null },
			include: coursePassInclude,
		});

		return result ? plainToInstance(CoursePass, result) : null;
	}

	async createCoursePass(
		data: Prisma.CoursePassUncheckedCreateInput,
	): Promise<CoursePass> {
		this.logger.debug("CoursePass 생성");

		const result = await this.txHost.tx.coursePass.create({
			data,
			include: coursePassInclude,
		});

		return plainToInstance(CoursePass, result);
	}

	async updateCoursePassById(
		id: string,
		data: Prisma.CoursePassUncheckedUpdateInput,
	): Promise<CoursePass> {
		this.logger.debug(`CoursePass 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.coursePass.update({
			where: { id },
			data,
			include: coursePassInclude,
		});

		return plainToInstance(CoursePass, result);
	}

	async updateCoursePassUsageById(
		id: string,
		data: Pick<
			Prisma.CoursePassUncheckedUpdateInput,
			"reservationUsedCount" | "reservationRemainingCount"
		>,
	): Promise<CoursePass> {
		this.logger.debug(`CoursePass 예약 사용량 수정: ${id.slice(-8)}`);

		return this.updateCoursePassById(id, data);
	}
}
