import { PaymentAggregate } from "@cocrepo/aggregate";
import { COMMON_ERRORS } from "@cocrepo/constant";
import type { QueryPaymentDto } from "@cocrepo/dto";
import { SpaceContext } from "@cocrepo/service";
import { buildOffsetStatsPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetStatsPaginatedResponse } from "@cocrepo/type";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class PaymentFacade {
	constructor(
		private readonly paymentService: PaymentAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	async getPayments(
		query: QueryPaymentDto,
	): Promise<
		OffsetStatsPaginatedResponse<
			Awaited<ReturnType<PaymentAggregate["findPayments"]>>["payments"]
		>
	> {
		this.requireSpaceId();
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const result = await this.paymentService.findPayments({
			skip,
			take,
			search: query.search ?? null,
			spaceId: query.spaceId,
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

	private requireSpaceId(): string {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}

		return spaceId;
	}
}
