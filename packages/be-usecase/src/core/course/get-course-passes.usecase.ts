import { CourseAggregate } from "@cocrepo/aggregate";
import { GetCoursePassesQuery } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/service";
import { buildOffsetStatsPaginatedResponse } from "@cocrepo/toolkit";
import { UnauthorizedException } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetCoursePassesQuery)
export class GetCoursePassesUseCase {
	constructor(
		private readonly courseService: CourseAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(query: GetCoursePassesQuery): Promise<unknown> {
		this.requireSpaceId();
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
		const result = await this.courseService.findCoursePasses({
			skip,
			take,
			search: query.query.search ?? null,
			courseId: query.query.courseId,
			courseOfferingId: query.query.courseOfferingId,
			enrollmentId: query.query.enrollmentId,
			userId: query.query.userId,
			timelineId: query.query.timelineId,
			status: query.query.status,
			kind: query.query.kind,
			validOn: query.query.validOn,
			expiresBefore: query.query.expiresBefore,
			sort: query.query.sort,
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
