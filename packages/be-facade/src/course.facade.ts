import { CourseAggregateRoot } from "@cocrepo/aggregate";
import { COMMON_ERRORS } from "@cocrepo/constant";
import type {
	QueryCourseDto,
	QueryCourseOfferingDto,
	QueryCoursePassDto,
	QueryEnrollmentDto,
} from "@cocrepo/dto";
import { SpaceContext } from "@cocrepo/service";
import { buildOffsetStatsPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetStatsPaginatedResponse } from "@cocrepo/type";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class CourseFacade {
	constructor(
		private readonly courseService: CourseAggregateRoot,
		private readonly spaceContext: SpaceContext,
	) {}

	async getCourses(
		query: QueryCourseDto,
	): Promise<
		OffsetStatsPaginatedResponse<
			Awaited<ReturnType<CourseAggregateRoot["findCourses"]>>["courses"]
		>
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

		return buildOffsetStatsPaginatedResponse(
			result.courses,
			result.total,
			skip,
			take,
		);
	}

	async getCourseOfferings(
		query: QueryCourseOfferingDto,
	): Promise<
		OffsetStatsPaginatedResponse<
			Awaited<
				ReturnType<CourseAggregateRoot["findCourseOfferings"]>
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

		return buildOffsetStatsPaginatedResponse(
			result.courseOfferings,
			result.total,
			skip,
			take,
		);
	}

	async getEnrollments(
		query: QueryEnrollmentDto,
	): Promise<
		OffsetStatsPaginatedResponse<
			Awaited<ReturnType<CourseAggregateRoot["findEnrollments"]>>["enrollments"]
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

		return buildOffsetStatsPaginatedResponse(
			result.enrollments,
			result.total,
			skip,
			take,
		);
	}

	async getCoursePasses(
		query: QueryCoursePassDto,
	): Promise<
		OffsetStatsPaginatedResponse<
			Awaited<
				ReturnType<CourseAggregateRoot["findCoursePasses"]>
			>["coursePasses"]
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

		return buildOffsetStatsPaginatedResponse(
			result.coursePasses,
			result.total,
			skip,
			take,
		);
	}

	private requireSpaceId(): string {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}

		return spaceId;
	}
}
