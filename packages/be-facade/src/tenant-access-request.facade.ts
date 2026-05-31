import { TenantAccessRequestAggregateRoot } from "@cocrepo/aggregate";
import type { ReviewTenantAccessRequestDto } from "@cocrepo/dto";
import type { TenantAccessRequest } from "@cocrepo/entity";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TenantAccessRequestFacade {
	constructor(
		private readonly tenantAccessRequestService: TenantAccessRequestAggregateRoot,
	) {}

	async listForReview(params: {
		reviewerId: string;
		where: Parameters<
			TenantAccessRequestAggregateRoot["listForReview"]
		>[0]["where"];
		orderBy: Parameters<
			TenantAccessRequestAggregateRoot["listForReview"]
		>[0]["orderBy"];
		skip?: number;
		take?: number;
	}) {
		const skip = params.skip ?? 0;
		const take = params.take ?? 10;
		const tenantAccessRequestResult =
			await this.tenantAccessRequestService.listForReview(params);

		return buildOffsetPaginatedResponse(
			tenantAccessRequestResult.items,
			tenantAccessRequestResult.totalCount,
			skip,
			take,
		);
	}

	getForReview(params: {
		tenantAccessRequestId: string;
		reviewerId: string;
	}): Promise<TenantAccessRequest> {
		return this.tenantAccessRequestService.findForReview(params);
	}

	approve(params: {
		tenantAccessRequestId: string;
		reviewerId: string;
		dto: ReviewTenantAccessRequestDto;
	}): Promise<TenantAccessRequest> {
		return this.tenantAccessRequestService.approve({
			tenantAccessRequestId: params.tenantAccessRequestId,
			reviewerId: params.reviewerId,
			reviewComment: params.dto.reviewComment,
		});
	}

	reject(params: {
		tenantAccessRequestId: string;
		reviewerId: string;
		dto: ReviewTenantAccessRequestDto;
	}): Promise<TenantAccessRequest> {
		return this.tenantAccessRequestService.reject({
			tenantAccessRequestId: params.tenantAccessRequestId,
			reviewerId: params.reviewerId,
			reviewComment: params.dto.reviewComment,
		});
	}
}
