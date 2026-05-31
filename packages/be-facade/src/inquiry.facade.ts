import {
	type FillInquiryFormInput,
	type FillInquiryFormResult,
	InquiryAggregateRoot,
	type InquiryCreateUpdateFormBootstrap,
	type InquiryStats,
} from "@cocrepo/aggregate";
import type { CreateInquiryDto } from "@cocrepo/dto";
import { Inquiry, InquiryMessage, InquiryParticipant } from "@cocrepo/entity";
import type { InquiryPriority, InquiryStatus } from "@cocrepo/prisma";
import { SpaceContext } from "@cocrepo/service";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetPaginatedResponse } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class InquiryFacade {
	private readonly logger = new Logger(InquiryFacade.name);

	constructor(
		private readonly inquiryService: InquiryAggregateRoot,
		private readonly spaceContext: SpaceContext,
	) {}

	async listInquiries(params: {
		where: Parameters<InquiryAggregateRoot["list"]>[0]["where"];
		orderBy: Parameters<InquiryAggregateRoot["list"]>[0]["orderBy"];
		skip?: number;
		take?: number;
	}): Promise<OffsetPaginatedResponse<Inquiry[]>> {
		this.logger.debug("문의 목록 조회");
		const skip = params.skip ?? 0;
		const take = params.take ?? 10;
		const inquiryResult = await this.inquiryService.list({
			...params,
			spaceIds: this.spaceContext.spaceIds,
		});

		return buildOffsetPaginatedResponse(
			inquiryResult.items,
			inquiryResult.totalCount,
			skip,
			take,
		);
	}

	getInquiryStats(): Promise<InquiryStats> {
		return this.inquiryService.getStats(this.spaceContext.spaceIds);
	}

	getCreateFormBootstrap(): Promise<InquiryCreateUpdateFormBootstrap> {
		return this.inquiryService.getCreateFormBootstrap();
	}

	getUpdateFormBootstrap(
		inquiryId: string,
	): Promise<InquiryCreateUpdateFormBootstrap> {
		return this.inquiryService.getUpdateFormBootstrap(
			inquiryId,
			this.spaceContext.spaceIds,
		);
	}

	fillFormWithAi(input: FillInquiryFormInput): FillInquiryFormResult {
		return this.inquiryService.fillFormWithAi(input);
	}

	getInquiryById(inquiryId: string): Promise<Inquiry> {
		return this.inquiryService.findByIdWithDetails(
			inquiryId,
			this.spaceContext.spaceIds,
		);
	}

	createInquiry(params: {
		dto: CreateInquiryDto;
		spaceId: string;
		actorUserId: string;
	}): Promise<Inquiry> {
		return this.inquiryService.create(
			{
				spaceId: params.spaceId,
				title: params.dto.title,
				category: params.dto.category,
				channel: params.dto.channel,
				source: params.dto.source,
				priority: params.dto.priority,
				customerId: params.dto.customerId,
				assigneeId: params.dto.assigneeId,
			},
			params.actorUserId,
			params.dto.content,
		);
	}

	updateInquiry(
		inquiryId: string,
		data: Parameters<InquiryAggregateRoot["update"]>[1],
	): Promise<Inquiry> {
		return this.inquiryService.update(inquiryId, data);
	}

	deleteInquiry(inquiryId: string): Promise<Inquiry> {
		return this.inquiryService.softDelete(inquiryId);
	}

	assignInquiry(inquiryId: string, assigneeId: string): Promise<Inquiry> {
		return this.inquiryService.assignTo(inquiryId, assigneeId);
	}

	updateInquiryStatus(
		inquiryId: string,
		status: InquiryStatus,
	): Promise<Inquiry> {
		return this.inquiryService.updateStatus(inquiryId, status);
	}

	updateInquiryPriority(
		inquiryId: string,
		priority: InquiryPriority,
	): Promise<Inquiry> {
		return this.inquiryService.updatePriority(inquiryId, priority);
	}

	async getInquiryMessages(params: {
		inquiryId: string;
		skip?: number;
		take?: number;
	}): Promise<OffsetPaginatedResponse<InquiryMessage[]>> {
		const skip = params.skip ?? 0;
		const take = params.take ?? 50;
		const messageResult = await this.inquiryService.listMessages(params);

		return buildOffsetPaginatedResponse(
			messageResult.items,
			messageResult.totalCount,
			skip,
			take,
		);
	}

	getInquiryParticipants(inquiryId: string): Promise<InquiryParticipant[]> {
		return this.inquiryService.getParticipants(inquiryId);
	}
}
