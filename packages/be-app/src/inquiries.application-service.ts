import type { CreateInquiryDto } from "@cocrepo/dto";
import { Inquiry, InquiryMessage, InquiryParticipant } from "@cocrepo/entity";
import type {
	InquiryParticipantRole,
	InquiryPriority,
	InquiryStatus,
	MessageContentType,
	SenderType,
} from "@cocrepo/prisma";
import {
	type FillInquiryFormInput,
	type FillInquiryFormResult,
	type InquiryCreateUpdateFormBootstrap,
	type InquiryStats,
	InquiriesService,
} from "@cocrepo/service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class InquiriesApplicationService {
	private readonly logger = new Logger(InquiriesApplicationService.name);

	constructor(private readonly inquiriesService: InquiriesService) {}

	async listInquiries(params: {
		where: Parameters<InquiriesService["list"]>[0]["where"];
		orderBy: Parameters<InquiriesService["list"]>[0]["orderBy"];
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
		const { items, totalCount } = await this.inquiriesService.list(params);

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
		return this.inquiriesService.getStats(spaceId);
	}

	getCreateFormBootstrap(): Promise<InquiryCreateUpdateFormBootstrap> {
		return this.inquiriesService.getCreateFormBootstrap();
	}

	getUpdateFormBootstrap(
		inquiryId: string,
	): Promise<InquiryCreateUpdateFormBootstrap> {
		return this.inquiriesService.getUpdateFormBootstrap(inquiryId);
	}

	fillFormWithAi(input: FillInquiryFormInput): FillInquiryFormResult {
		return this.inquiriesService.fillFormWithAi(input);
	}

	getInquiryById(inquiryId: string): Promise<Inquiry> {
		return this.inquiriesService.findByIdWithDetails(inquiryId);
	}

	createInquiry(params: {
		dto: CreateInquiryDto;
		spaceId: string;
		actorUserId: string;
	}): Promise<Inquiry> {
		return this.inquiriesService.create(
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
		data: Parameters<InquiriesService["update"]>[1],
	): Promise<Inquiry> {
		return this.inquiriesService.update(inquiryId, data);
	}

	deleteInquiry(inquiryId: string): Promise<Inquiry> {
		return this.inquiriesService.softDelete(inquiryId);
	}

	assignInquiry(inquiryId: string, assigneeId: string): Promise<Inquiry> {
		return this.inquiriesService.assignTo(inquiryId, assigneeId);
	}

	updateInquiryStatus(
		inquiryId: string,
		status: InquiryStatus,
	): Promise<Inquiry> {
		return this.inquiriesService.updateStatus(inquiryId, status);
	}

	updateInquiryPriority(
		inquiryId: string,
		priority: InquiryPriority,
	): Promise<Inquiry> {
		return this.inquiriesService.updatePriority(inquiryId, priority);
	}

	getInquiryMessages(params: {
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
		const { items, totalCount } = await this.inquiriesService.listMessages(params);

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

	sendInquiryMessage(params: {
		inquiryId: string;
		actorUserId: string;
		threadId?: string;
		content: string;
		contentType?: MessageContentType;
		senderType?: SenderType;
		clientMessageId?: string;
	}): Promise<InquiryMessage> {
		return this.inquiriesService.sendMessage(params);
	}

	getInquiryParticipants(inquiryId: string): Promise<InquiryParticipant[]> {
		return this.inquiriesService.getParticipants(inquiryId);
	}

	joinInquiry(params: {
		inquiryId: string;
		userId: string;
		threadId?: string;
		role?: InquiryParticipantRole;
	}): Promise<InquiryParticipant> {
		return this.inquiriesService.joinParticipant(params);
	}
}
