import { PaymentAggregate } from "@cocrepo/aggregate";
import { GetPaymentsQuery } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/service";
import { buildOffsetStatsPaginatedResponse } from "@cocrepo/toolkit";
import { UnauthorizedException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetPaymentsQuery)
export class GetPaymentsUseCase implements IQueryHandler<GetPaymentsQuery> {
	constructor(
		private readonly paymentService: PaymentAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(query: GetPaymentsQuery): Promise<unknown> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
		const result = await this.paymentService.findPayments({
			skip,
			take,
			search: query.query.search ?? null,
			spaceId: query.query.spaceId,
			payerUserId: query.query.payerUserId,
			status: query.query.status,
			method: query.query.method,
			provider: query.query.provider,
			providerOrderId: query.query.providerOrderId,
			subjectType: query.query.subjectType,
			subjectId: query.query.subjectId,
			referenceType: query.query.referenceType,
			referenceId: query.query.referenceId,
			approvedFrom: query.query.approvedFrom,
			approvedUntil: query.query.approvedUntil,
			sort: query.query.sort,
		});
		return buildOffsetStatsPaginatedResponse(
			result.payments,
			result.total,
			skip,
			take,
		);
	}
}
