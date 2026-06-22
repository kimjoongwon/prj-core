import { CourseAggregate } from "@cocrepo/aggregate";
import { GetEnrollmentsQuery } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { buildOffsetStatsPaginatedResponse } from "@cocrepo/toolkit";
import { UnauthorizedException } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetEnrollmentsQuery)
export class GetEnrollmentsUseCase {
	constructor(
		private readonly courseService: CourseAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(query: GetEnrollmentsQuery): Promise<unknown> {
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

	private requireSpaceId(): string {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}
		return spaceId;
	}
}
