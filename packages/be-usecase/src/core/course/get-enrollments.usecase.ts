import { CourseAggregate } from "@cocrepo/aggregate";
import { GetEnrollmentsQuery } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/service";
import { buildOffsetStatsPaginatedResponse } from "@cocrepo/toolkit";
import { UnauthorizedException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetEnrollmentsQuery)
export class GetEnrollmentsUseCase
	implements IQueryHandler<GetEnrollmentsQuery>
{
	constructor(
		private readonly courseService: CourseAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(query: GetEnrollmentsQuery): Promise<unknown> {
		this.requireSpaceId();
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
		const result = await this.courseService.findEnrollments({
			skip,
			take,
			search: query.query.search ?? null,
			courseId: query.query.courseId,
			courseOfferingId: query.query.courseOfferingId,
			userId: query.query.userId,
			timelineId: query.query.timelineId,
			paymentStatus: query.query.paymentStatus,
			status: query.query.status,
			validOn: query.query.validOn,
			sort: query.query.sort,
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
