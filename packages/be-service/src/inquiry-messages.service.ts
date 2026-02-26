import { InquiryMessage } from "@cocrepo/entity";
import type { Prisma, SenderType } from "@cocrepo/prisma";
import { InquiryMessagesRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class InquiryMessagesService {
	private readonly logger = new Logger(InquiryMessagesService.name);

	constructor(private readonly repository: InquiryMessagesRepository) {}

	// ============================================================================
	// 조회
	// ============================================================================

	/**
	 * ID로 메시지 조회
	 */
	async findById(id: string): Promise<InquiryMessage> {
		const message = await this.repository.findById(id);
		if (!message) {
			throw new NotFoundException("메시지를 찾을 수 없습니다");
		}
		return message;
	}

	/**
	 * 스레드별 메시지 목록 조회
	 */
	async listByThread(params: {
		threadId: string;
		where?: Prisma.InquiryMessageWhereInput;
		orderBy?: Prisma.InquiryMessageOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryMessage[]; totalCount: number }> {
		return this.repository.findManyByThreadId(params);
	}

	/**
	 * 문의별 메시지 목록 조회
	 */
	async listByInquiry(params: {
		inquiryId: string;
		where?: Prisma.InquiryMessageWhereInput;
		orderBy?: Prisma.InquiryMessageOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryMessage[]; totalCount: number }> {
		return this.repository.findManyByInquiryId(params);
	}

	/**
	 * 발신자 유형별 메시지 목록 조회
	 */
	async listBySenderType(params: {
		inquiryId: string;
		senderType: SenderType;
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryMessage[]; totalCount: number }> {
		return this.repository.findManyBySenderType(params);
	}

	/**
	 * 스레드의 최신 메시지 조회
	 */
	async getLatestByThread(threadId: string): Promise<InquiryMessage | null> {
		return this.repository.findLatestByThreadId(threadId);
	}

	// ============================================================================
	// 생성
	// ============================================================================

	/**
	 * 메시지 생성 (clientMessageId 중복 검사)
	 */
	async create(
		data: Prisma.InquiryMessageUncheckedCreateInput,
	): Promise<InquiryMessage> {
		this.logger.debug("메시지 생성 중...");

		// clientMessageId 중복 검사
		if (data.clientMessageId) {
			const exists = await this.repository.existsByClientMessageId(
				data.threadId,
				data.clientMessageId,
			);
			if (exists) {
				throw new BadRequestException(
					"이미 처리된 메시지입니다 (중복 clientMessageId)",
				);
			}
		}

		return this.repository.create(data);
	}

	// ============================================================================
	// 전달/읽음 상태
	// ============================================================================

	/**
	 * 전달 완료 처리
	 */
	async markDelivered(id: string): Promise<InquiryMessage> {
		this.logger.debug(`전달 완료 처리: ${id.slice(-8)}`);

		// 존재 확인
		await this.findById(id);

		return this.repository.markDeliveredById(id);
	}

	/**
	 * 읽음 처리
	 */
	async markRead(id: string): Promise<InquiryMessage> {
		this.logger.debug(`읽음 처리: ${id.slice(-8)}`);

		// 존재 확인
		await this.findById(id);

		return this.repository.markReadById(id);
	}

	/**
	 * 스레드의 모든 메시지 읽음 처리
	 */
	async markAllRead(threadId: string, beforeThan?: Date): Promise<number> {
		this.logger.debug(`스레드 메시지 일괄 읽음 처리: ${threadId.slice(-8)}`);
		return this.repository.markAllReadByThreadId(threadId, beforeThan);
	}

	// ============================================================================
	// 수정/삭제
	// ============================================================================

	/**
	 * 메시지 수정
	 */
	async update(
		id: string,
		data: Prisma.InquiryMessageUncheckedUpdateInput,
	): Promise<InquiryMessage> {
		this.logger.debug(`메시지 수정: ${id.slice(-8)}`);

		// 존재 확인
		const message = await this.findById(id);

		// 삭제된 메시지는 수정 불가
		if (message.isDeleted) {
			throw new BadRequestException("삭제된 메시지는 수정할 수 없습니다");
		}

		return this.repository.updateById(id, {
			...data,
			isEdited: true,
			editedAt: new Date(),
		});
	}

	/**
	 * 소프트 삭제 (내용 숨김)
	 */
	async softDelete(id: string): Promise<InquiryMessage> {
		this.logger.debug(`메시지 소프트 삭제: ${id.slice(-8)}`);

		// 존재 확인
		await this.findById(id);

		return this.repository.removeById(id);
	}

	// ============================================================================
	// 통계
	// ============================================================================

	/**
	 * 스레드별 메시지 수 조회
	 */
	async countByThread(threadId: string): Promise<number> {
		return this.repository.countByThreadId(threadId);
	}

	/**
	 * 문의별 메시지 수 조회
	 */
	async countByInquiry(inquiryId: string): Promise<number> {
		return this.repository.countByInquiryId(inquiryId);
	}
}
