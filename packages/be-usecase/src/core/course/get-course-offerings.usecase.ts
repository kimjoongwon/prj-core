import { CourseAggregate } from "@cocrepo/aggregate";
import { GetCourseOfferingsQuery } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { buildOffsetStatsPaginatedResponse } from "@cocrepo/toolkit";
import { UnauthorizedException } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetCourseOfferingsQuery)
export class GetCourseOfferingsUseCase {
	constructor(
		private readonly courseService: CourseAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(query: GetCourseOfferingsQuery): Promise<unknown> {
		this.requireSpaceId();
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const result = await this.courseService.findCourseOfferings({
			skip,
			take,
			search: query.search ?? null,
			courseId: query.courseId,
			tenantId: query.tenantId,
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

	private requireSpaceId(): string {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}
		return spaceId;
	}
}
