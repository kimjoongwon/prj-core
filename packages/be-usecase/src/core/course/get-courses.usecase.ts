import { CourseAggregate } from "@cocrepo/aggregate";
import { GetCoursesQuery } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/service";
import { buildOffsetStatsPaginatedResponse } from "@cocrepo/toolkit";
import { UnauthorizedException } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetCoursesQuery)
export class GetCoursesUseCase {
	constructor(
		private readonly courseService: CourseAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(query: GetCoursesQuery): Promise<unknown> {
		this.requireSpaceId();
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
		const result = await this.courseService.findCourses({
			skip,
			take,
			search: query.query.search ?? null,
			status: query.query.status,
			spaceId: query.query.spaceId,
			sort: query.query.sort,
		});
		return buildOffsetStatsPaginatedResponse(
			result.courses,
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
