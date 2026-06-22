import { CourseAggregate } from "@cocrepo/aggregate";
import { GetCoursePassesQuery } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
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
