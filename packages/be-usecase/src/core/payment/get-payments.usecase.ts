import { PaymentAggregate } from "@cocrepo/aggregate";
import { GetPaymentsQuery } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { buildOffsetStatsPaginatedResponse } from "@cocrepo/toolkit";
import { UnauthorizedException } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetPaymentsQuery)
export class GetPaymentsUseCase {
	constructor(
		private readonly paymentService: PaymentAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(query: GetPaymentsQuery): Promise<unknown> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const result = await this.paymentService.findPayments({
			skip,
			take,
			search: query.search ?? null,
			tenantId: query.tenantId,
			payerUserId: query.payerUserId,
			status: query.status,
			method: query.method,
			provider: query.provider,
			providerOrderId: query.providerOrderId,
			subjectType: query.subjectType,
			subjectId: query.subjectId,
			referenceType: query.referenceType,
			referenceId: query.referenceId,
			approvedFrom: query.approvedFrom,
			approvedUntil: query.approvedUntil,
			sort: query.sort,
		});
		return buildOffsetStatsPaginatedResponse(
			result.payments,
			result.total,
			skip,
			take,
		);
	}
}
