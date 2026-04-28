import type {
	CreateTenantAccessRequestDto,
	ReviewTenantAccessRequestDto,
} from "@cocrepo/dto";
import type { TenantAccessRequest } from "@cocrepo/entity";
import { TenantAccessRequestService } from "@cocrepo/service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class TenantAccessRequestFacade {
	private readonly logger = new Logger(TenantAccessRequestFacade.name);

	constructor(
		private readonly tenantAccessRequestService: TenantAccessRequestService,
	) {}

	getCreateFormBootstrap() {
		this.logger.debug("테넌트 접근 신청 생성 폼 조회");
		return this.tenantAccessRequestService.getCreateFormBootstrap();
	}

	create(params: {
		requesterId: string;
		dto: CreateTenantAccessRequestDto;
	}): Promise<TenantAccessRequest> {
		return this.tenantAccessRequestService.create(
			params.requesterId,
			params.dto,
		);
	}

	async listMine(params: {
		requesterId: string;
		where: Parameters<TenantAccessRequestService["listMine"]>[0]["where"];
		orderBy: Parameters<TenantAccessRequestService["listMine"]>[0]["orderBy"];
		skip?: number;
		take?: number;
	}) {
		const skip = params.skip ?? 0;
		const take = params.take ?? 10;
		const { items, totalCount } =
			await this.tenantAccessRequestService.listMine(params);

		return this.buildPaginationResponse(items, totalCount, skip, take);
	}

	async listForReview(params: {
		reviewerId: string;
		where: Parameters<TenantAccessRequestService["listForReview"]>[0]["where"];
		orderBy: Parameters<
			TenantAccessRequestService["listForReview"]
		>[0]["orderBy"];
		skip?: number;
		take?: number;
	}) {
		const skip = params.skip ?? 0;
		const take = params.take ?? 10;
		const { items, totalCount } =
			await this.tenantAccessRequestService.listForReview(params);

		return this.buildPaginationResponse(items, totalCount, skip, take);
	}

	getForReview(params: {
		tenantAccessRequestId: string;
		reviewerId: string;
	}): Promise<TenantAccessRequest> {
		return this.tenantAccessRequestService.findForReview(params);
	}

	cancel(params: {
		tenantAccessRequestId: string;
		requesterId: string;
	}): Promise<TenantAccessRequest> {
		return this.tenantAccessRequestService.cancel(params);
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

	private buildPaginationResponse(
		data: TenantAccessRequest[],
		total: number,
		skip: number,
		take: number,
	) {
		return {
			data,
			meta: {
				total,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(total / take) : 1,
			},
		};
	}
}
