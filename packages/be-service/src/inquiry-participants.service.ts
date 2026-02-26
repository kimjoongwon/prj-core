import { InquiryParticipant } from "@cocrepo/entity";
import type { InquiryParticipantRole, Prisma } from "@cocrepo/prisma";
import { InquiryParticipantsRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class InquiryParticipantsService {
	private readonly logger = new Logger(InquiryParticipantsService.name);

	constructor(private readonly repository: InquiryParticipantsRepository) {}

	// ============================================================================
	// 조회
	// ============================================================================

	/**
	 * ID로 참여자 조회
	 */
	async findById(id: string): Promise<InquiryParticipant> {
		const participant = await this.repository.findById(id);
		if (!participant) {
			throw new NotFoundException("참여자를 찾을 수 없습니다");
		}
		return participant;
	}

	/**
	 * 문의별 참여자 목록 조회
	 */
	async getByInquiry(
		inquiryId: string,
		where?: Prisma.InquiryParticipantWhereInput,
	): Promise<InquiryParticipant[]> {
		return this.repository.findManyByInquiryId({ inquiryId, where });
	}

	/**
	 * 스레드별 참여자 목록 조회
	 */
	async getByThread(
		threadId: string,
		where?: Prisma.InquiryParticipantWhereInput,
	): Promise<InquiryParticipant[]> {
		return this.repository.findManyByThreadId({ threadId, where });
	}

	/**
	 * 문의와 사용자로 참여자 조회
	 */
	async getByInquiryAndUser(
		inquiryId: string,
		userId: string,
	): Promise<InquiryParticipant | null> {
		return this.repository.findByInquiryIdAndUserId(inquiryId, userId);
	}

	/**
	 * 역할별 참여자 목록 조회
	 */
	async getByRole(
		inquiryId: string,
		role: InquiryParticipantRole,
	): Promise<InquiryParticipant[]> {
		return this.repository.findManyByRole({ inquiryId, role });
	}

	/**
	 * 문의 내 온라인 참여자 수 조회
	 */
	async countOnline(inquiryId: string): Promise<number> {
		return this.repository.countOnlineByInquiryId(inquiryId);
	}

	// ============================================================================
	// 참여/나가기
	// ============================================================================

	/**
	 * 참여자 입장 (온라인 상태로)
	 */
	async join(params: {
		inquiryId: string;
		userId: string;
		threadId?: string;
		role?: InquiryParticipantRole;
	}): Promise<InquiryParticipant> {
		this.logger.debug(
			`참여자 입장: inquiry=${params.inquiryId.slice(-8)}, user=${params.userId.slice(-8)}`,
		);

		// 기존 참여자 확인
		const existing = await this.repository.findByInquiryIdAndUserId(
			params.inquiryId,
			params.userId,
		);

		if (existing) {
			// 이미 참여 중이면 온라인 상태로 변경
			return this.repository.updateOnlineStatusById(existing.id, true);
		}

		// 새 참여자 생성
		return this.repository.create({
			inquiryId: params.inquiryId,
			userId: params.userId,
			threadId: params.threadId ?? null,
			role: params.role ?? "VIEWER",
			isOnline: true,
			isTyping: false,
			unreadCount: 0,
			joinedAt: new Date(),
		});
	}

	/**
	 * 참여자 퇴장 (오프라인 상태로)
	 */
	async leave(inquiryId: string, userId: string): Promise<InquiryParticipant> {
		this.logger.debug(
			`참여자 퇴장: inquiry=${inquiryId.slice(-8)}, user=${userId.slice(-8)}`,
		);

		const participant = await this.repository.findByInquiryIdAndUserId(
			inquiryId,
			userId,
		);

		if (!participant) {
			throw new NotFoundException("참여자를 찾을 수 없습니다");
		}

		return this.repository.markLeftById(participant.id);
	}

	// ============================================================================
	// 온라인/타이핑 상태
	// ============================================================================

	/**
	 * 온라인 상태 업데이트
	 */
	async updateOnlineStatus(
		inquiryId: string,
		userId: string,
		isOnline: boolean,
	): Promise<InquiryParticipant> {
		this.logger.debug(
			`온라인 상태 업데이트: inquiry=${inquiryId.slice(-8)}, user=${userId.slice(-8)}, isOnline=${isOnline}`,
		);

		const participant = await this.repository.findByInquiryIdAndUserId(
			inquiryId,
			userId,
		);

		if (!participant) {
			throw new NotFoundException("참여자를 찾을 수 없습니다");
		}

		return this.repository.updateOnlineStatusById(participant.id, isOnline);
	}

	/**
	 * 타이핑 상태 업데이트
	 */
	async updateTypingStatus(
		inquiryId: string,
		userId: string,
		isTyping: boolean,
	): Promise<InquiryParticipant> {
		this.logger.debug(
			`타이핑 상태 업데이트: inquiry=${inquiryId.slice(-8)}, user=${userId.slice(-8)}, isTyping=${isTyping}`,
		);

		const participant = await this.repository.findByInquiryIdAndUserId(
			inquiryId,
			userId,
		);

		if (!participant) {
			throw new NotFoundException("참여자를 찾을 수 없습니다");
		}

		// 오프라인 상태에서는 타이핑 불가
		if (!participant.isOnline && isTyping) {
			throw new BadRequestException(
				"오프라인 상태에서는 타이핑 상태를 활성화할 수 없습니다",
			);
		}

		return this.repository.updateTypingStatusById(participant.id, isTyping);
	}

	// ============================================================================
	// 읽음 상태
	// ============================================================================

	/**
	 * 마지막 접속 시간 업데이트
	 */
	async updateLastSeen(
		inquiryId: string,
		userId: string,
	): Promise<InquiryParticipant> {
		const participant = await this.repository.findByInquiryIdAndUserId(
			inquiryId,
			userId,
		);

		if (!participant) {
			throw new NotFoundException("참여자를 찾을 수 없습니다");
		}

		return this.repository.updateLastSeenById(participant.id);
	}

	/**
	 * 읽음 처리
	 */
	async markAsRead(
		inquiryId: string,
		userId: string,
	): Promise<InquiryParticipant> {
		this.logger.debug(
			`읽음 처리: inquiry=${inquiryId.slice(-8)}, user=${userId.slice(-8)}`,
		);

		const participant = await this.repository.findByInquiryIdAndUserId(
			inquiryId,
			userId,
		);

		if (!participant) {
			throw new NotFoundException("참여자를 찾을 수 없습니다");
		}

		return this.repository.markAsReadById(participant.id);
	}

	/**
	 * 읽지 않은 메시지 수 증가 (단일 참여자)
	 */
	async incrementUnread(
		inquiryId: string,
		userId: string,
	): Promise<InquiryParticipant> {
		const participant = await this.repository.findByInquiryIdAndUserId(
			inquiryId,
			userId,
		);

		if (!participant) {
			throw new NotFoundException("참여자를 찾을 수 없습니다");
		}

		return this.repository.incrementUnreadCountById(participant.id);
	}

	/**
	 * 읽지 않은 메시지 수 일괄 증가 (발신자 제외)
	 */
	async incrementUnreadForOthers(
		inquiryId: string,
		excludeUserId?: string,
	): Promise<number> {
		this.logger.debug(
			`읽지 않은 메시지 수 일괄 증가: inquiry=${inquiryId.slice(-8)}`,
		);
		return this.repository.incrementUnreadCountByInquiryId(
			inquiryId,
			excludeUserId,
		);
	}

	// ============================================================================
	// 역할 관리
	// ============================================================================

	/**
	 * 역할 업데이트
	 */
	async updateRole(
		inquiryId: string,
		userId: string,
		role: InquiryParticipantRole,
	): Promise<InquiryParticipant> {
		this.logger.debug(
			`역할 업데이트: inquiry=${inquiryId.slice(-8)}, user=${userId.slice(-8)}, role=${role}`,
		);

		const participant = await this.repository.findByInquiryIdAndUserId(
			inquiryId,
			userId,
		);

		if (!participant) {
			throw new NotFoundException("참여자를 찾을 수 없습니다");
		}

		return this.repository.updateRoleById(participant.id, role);
	}

	// ============================================================================
	// 다중 생성
	// ============================================================================

	/**
	 * 참여자 다중 생성 (초기 참여자 설정용)
	 */
	async createMany(
		data: Prisma.InquiryParticipantUncheckedCreateInput[],
	): Promise<number> {
		this.logger.debug(`참여자 다중 생성: count=${data.length}`);
		return this.repository.createMany(data);
	}
}
