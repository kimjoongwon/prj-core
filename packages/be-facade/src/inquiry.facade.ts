import type { CreateInquiryDto } from "@cocrepo/dto";
import { Inquiry, InquiryMessage, InquiryParticipant } from "@cocrepo/entity";
import type {
	InquiryPriority,
	InquiryStatus,
} from "@cocrepo/prisma";
import {
	type FillInquiryFormInput,
	type FillInquiryFormResult,
	type InquiryCreateUpdateFormBootstrap,
	type InquiryStats,
	InquiryService,
} from "@cocrepo/service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class InquiryFacade {
	private readonly logger = new Logger(InquiryFacade.name);

	constructor(private readonly inquiryService: InquiryService) {}

	async listInquiries(params: {
		where: Parameters<InquiryService["list"]>[0]["where"];
		orderBy: Parameters<InquiryService["list"]>[0]["orderBy"];
		skip?: number;
		take?: number;
	}): Promise<{
		data: Inquiry[];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
	}> {
		this.logger.debug("문의 목록 조회");
		const skip = params.skip ?? 0;
		const take = params.take ?? 10;
		const { items, totalCount } = await this.inquiryService.list(params);

		return {
			data: items,
			meta: {
				total: totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(totalCount / take) : 1,
			},
		};
	}

	getInquiryStats(spaceId: string): Promise<InquiryStats> {
		return this.inquiryService.getStats(spaceId);
	}

	getCreateFormBootstrap(): Promise<InquiryCreateUpdateFormBootstrap> {
		return this.inquiryService.getCreateFormBootstrap();
	}

	getUpdateFormBootstrap(
		inquiryId: string,
	): Promise<InquiryCreateUpdateFormBootstrap> {
		return this.inquiryService.getUpdateFormBootstrap(inquiryId);
	}

	fillFormWithAi(input: FillInquiryFormInput): FillInquiryFormResult {
		return this.inquiryService.fillFormWithAi(input);
	}

	getInquiryById(inquiryId: string): Promise<Inquiry> {
		return this.inquiryService.findByIdWithDetails(inquiryId);
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
		data: Parameters<InquiryService["update"]>[1],
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
	}): Promise<{
		data: InquiryMessage[];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
	}> {
		const skip = params.skip ?? 0;
		const take = params.take ?? 50;
		const { items, totalCount } = await this.inquiryService.listMessages(params);

		return {
			data: items,
			meta: {
				total: totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(totalCount / take) : 1,
			},
		};
	}

	getInquiryParticipants(inquiryId: string): Promise<InquiryParticipant[]> {
		return this.inquiryService.getParticipants(inquiryId);
	}
}
