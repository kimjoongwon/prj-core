import { COMMON_ERRORS } from "@cocrepo/constant";
import type {
	QueryCourseDto,
	QueryCourseOfferingDto,
	QueryCoursePassDto,
	QueryEnrollmentDto,
} from "@cocrepo/dto";
import { CourseService, SpaceContext } from "@cocrepo/service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

type ListResponse<TItems> = {
	data: TItems;
	meta: {
		total: number;
		skip: number;
		take: number;
		totalPages: number;
	};
	stats: {
		total: number;
	};
};

@Injectable()
export class CourseFacade {
	constructor(
		private readonly courseService: CourseService,
		private readonly spaceContext: SpaceContext,
	) {}

	async getCourses(
		query: QueryCourseDto,
	): Promise<
		ListResponse<Awaited<ReturnType<CourseService["findCourses"]>>["courses"]>
	> {
		this.requireSpaceId();
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const result = await this.courseService.findCourses({
			skip,
			take,
			search: query.search ?? null,
			status: query.status,
			spaceId: query.spaceId,
			sort: query.sort,
		});

		return this.toListResponse(result.courses, result.total, skip, take);
	}

	getCourseById(courseId: string) {
		this.requireSpaceId();
		return this.courseService.findCourseDetails(courseId);
	}

	async getCourseOfferings(
		query: QueryCourseOfferingDto,
	): Promise<
		ListResponse<
			Awaited<
				ReturnType<CourseService["findCourseOfferings"]>
			>["courseOfferings"]
		>
	> {
		this.requireSpaceId();
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const result = await this.courseService.findCourseOfferings({
			skip,
			take,
			search: query.search ?? null,
			courseId: query.courseId,
			spaceId: query.spaceId,
			timelineId: query.timelineId,
			status: query.status,
			timelineProvisioningMode: query.timelineProvisioningMode,
			recruitingOnly: query.recruitingOnly,
			sort: query.sort,
		});

		return this.toListResponse(
			result.courseOfferings,
			result.total,
			skip,
			take,
		);
	}

	getCourseOfferingById(courseOfferingId: string) {
		this.requireSpaceId();
		return this.courseService.findCourseOfferingDetails(courseOfferingId);
	}

	async getEnrollments(
		query: QueryEnrollmentDto,
	): Promise<
		ListResponse<
			Awaited<ReturnType<CourseService["findEnrollments"]>>["enrollments"]
		>
	> {
		this.requireSpaceId();
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const result = await this.courseService.findEnrollments({
			skip,
			take,
			search: query.search ?? null,
			courseId: query.courseId,
			courseOfferingId: query.courseOfferingId,
			userId: query.userId,
			timelineId: query.timelineId,
			paymentStatus: query.paymentStatus,
			status: query.status,
			validOn: query.validOn,
			sort: query.sort,
		});

		return this.toListResponse(result.enrollments, result.total, skip, take);
	}

	getEnrollmentById(enrollmentId: string) {
		this.requireSpaceId();
		return this.courseService.findEnrollmentDetails(enrollmentId);
	}

	async getCoursePasses(
		query: QueryCoursePassDto,
	): Promise<
		ListResponse<
			Awaited<ReturnType<CourseService["findCoursePasses"]>>["coursePasses"]
		>
	> {
		this.requireSpaceId();
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const result = await this.courseService.findCoursePasses({
			skip,
			take,
			search: query.search ?? null,
			courseId: query.courseId,
			courseOfferingId: query.courseOfferingId,
			enrollmentId: query.enrollmentId,
			userId: query.userId,
			timelineId: query.timelineId,
			status: query.status,
			kind: query.kind,
			validOn: query.validOn,
			expiresBefore: query.expiresBefore,
			sort: query.sort,
		});

		return this.toListResponse(result.coursePasses, result.total, skip, take);
	}

	getCoursePassById(coursePassId: string) {
		this.requireSpaceId();
		return this.courseService.findCoursePassDetails(coursePassId);
	}

	async getCoursePassUpdateReadModel(coursePassId: string): Promise<{
		data: Awaited<ReturnType<CourseService["findCoursePassDetails"]>>;
	}> {
		const data = await this.getCoursePassById(coursePassId);

		return { data };
	}

	private toListResponse<TItems>(
		data: TItems,
		total: number,
		skip: number,
		take: number,
	): ListResponse<TItems> {
		return {
			data,
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

	private requireSpaceId(): string {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}

		return spaceId;
	}
}
