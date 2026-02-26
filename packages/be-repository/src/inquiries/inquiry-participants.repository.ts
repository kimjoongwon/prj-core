import { InquiryParticipant } from "@cocrepo/entity";
import { InquiryParticipantRole, Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class InquiryParticipantsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("InquiryParticipantsRepository");
	}

	// ============================================================================
	// 기본 CRUD
	// ============================================================================

	/**
	 * ID로 조회
	 */
	async findById(id: string): Promise<InquiryParticipant | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryParticipant.findUnique({
			where: { id },
		});

		return result ? plainToInstance(InquiryParticipant, result) : null;
	}

	/**
	 * 생성
	 */
	async create(
		data: Prisma.InquiryParticipantUncheckedCreateInput,
	): Promise<InquiryParticipant> {
		this.logger.debug("참여자 생성 중...");

		const result = await this.txHost.tx.inquiryParticipant.create({
			data,
		});

		return plainToInstance(InquiryParticipant, result);
	}

	/**
	 * 다중 생성
	 */
	async createMany(
		data: Prisma.InquiryParticipantUncheckedCreateInput[],
	): Promise<number> {
		this.logger.debug(`참여자 다중 생성: count=${data.length}`);

		const result = await this.txHost.tx.inquiryParticipant.createMany({
			data,
			skipDuplicates: true,
		});

		return result.count;
	}

	// ============================================================================
	// 조회
	// ============================================================================

	/**
	 * 문의별 참여자 목록 조회
	 */
	async findManyByInquiryId(params: {
		inquiryId: string;
		where?: Prisma.InquiryParticipantWhereInput;
	}): Promise<InquiryParticipant[]> {
		const { inquiryId, where } = params;
		this.logger.debug(`문의별 참여자 조회: ${inquiryId.slice(-8)}`);

		const results = await this.txHost.tx.inquiryParticipant.findMany({
			where: {
				inquiryId,
				leftAt: null,
				...where,
			},
			include: {
				user: {
					select: { id: true, name: true, email: true },
				},
			},
		});

		return results.map((result) => plainToInstance(InquiryParticipant, result));
	}

	/**
	 * 문의와 사용자로 참여자 조회
	 */
	async findByInquiryIdAndUserId(
		inquiryId: string,
		userId: string,
	): Promise<InquiryParticipant | null> {
		this.logger.debug(
			`문의+사용자로 참여자 조회: inquiry=${inquiryId.slice(-8)}, user=${userId.slice(-8)}`,
		);

		const result = await this.txHost.tx.inquiryParticipant.findFirst({
			where: {
				inquiryId,
				userId,
				leftAt: null,
			},
		});

		return result ? plainToInstance(InquiryParticipant, result) : null;
	}

	/**
	 * 스레드별 참여자 목록 조회
	 */
	async findManyByThreadId(params: {
		threadId: string;
		where?: Prisma.InquiryParticipantWhereInput;
	}): Promise<InquiryParticipant[]> {
		const { threadId, where } = params;
		this.logger.debug(`스레드별 참여자 조회: ${threadId.slice(-8)}`);

		const results = await this.txHost.tx.inquiryParticipant.findMany({
			where: {
				threadId,
				leftAt: null,
				...where,
			},
			include: {
				user: {
					select: { id: true, name: true, email: true },
				},
			},
		});

		return results.map((result) => plainToInstance(InquiryParticipant, result));
	}

	// ============================================================================
	// 온라인/타이핑 상태
	// ============================================================================

	/**
	 * 온라인 상태 업데이트
	 */
	async updateOnlineStatusById(
		id: string,
		isOnline: boolean,
	): Promise<InquiryParticipant> {
		this.logger.debug(`온라인 상태 업데이트: ${id.slice(-8)} -> ${isOnline}`);

		const result = await this.txHost.tx.inquiryParticipant.update({
			where: { id },
			data: {
				isOnline,
				lastSeenAt: new Date(),
				// 오프라인이면 타이핑 상태도 false
				...(isOnline === false && { isTyping: false }),
			},
		});

		return plainToInstance(InquiryParticipant, result);
	}

	/**
	 * 타이핑 상태 업데이트
	 */
	async updateTypingStatusById(
		id: string,
		isTyping: boolean,
	): Promise<InquiryParticipant> {
		this.logger.debug(`타이핑 상태 업데이트: ${id.slice(-8)} -> ${isTyping}`);

		const result = await this.txHost.tx.inquiryParticipant.update({
			where: { id },
			data: { isTyping },
		});

		return plainToInstance(InquiryParticipant, result);
	}

	/**
	 * 문의 내 온라인 참여자 수 조회
	 */
	async countOnlineByInquiryId(inquiryId: string): Promise<number> {
		this.logger.debug(`온라인 참여자 수 조회: ${inquiryId.slice(-8)}`);

		return this.txHost.tx.inquiryParticipant.count({
			where: {
				inquiryId,
				isOnline: true,
				leftAt: null,
			},
		});
	}

	// ============================================================================
	// 읽음 상태
	// ============================================================================

	/**
	 * 마지막 접속 시간 업데이트
	 */
	async updateLastSeenById(id: string): Promise<InquiryParticipant> {
		this.logger.debug(`마지막 접속 시간 업데이트: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryParticipant.update({
			where: { id },
			data: { lastSeenAt: new Date() },
		});

		return plainToInstance(InquiryParticipant, result);
	}

	/**
	 * 읽음 처리 (lastReadAt, unreadCount=0)
	 */
	async markAsReadById(id: string): Promise<InquiryParticipant> {
		this.logger.debug(`읽음 처리: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryParticipant.update({
			where: { id },
			data: {
				lastReadAt: new Date(),
				unreadCount: 0,
			},
		});

		return plainToInstance(InquiryParticipant, result);
	}

	/**
	 * 읽지 않은 메시지 수 증가
	 */
	async incrementUnreadCountById(id: string): Promise<InquiryParticipant> {
		this.logger.debug(`읽지 않은 메시지 수 증가: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryParticipant.update({
			where: { id },
			data: {
				unreadCount: { increment: 1 },
			},
		});

		return plainToInstance(InquiryParticipant, result);
	}

	/**
	 * 문의 내 특정 사용자들의 읽지 않은 메시지 수 일괄 증가
	 */
	async incrementUnreadCountByInquiryId(
		inquiryId: string,
		excludeUserId?: string,
	): Promise<number> {
		this.logger.debug(`읽지 않은 메시지 수 일괄 증가: ${inquiryId.slice(-8)}`);

		const where: Prisma.InquiryParticipantWhereInput = {
			inquiryId,
			leftAt: null,
		};

		if (excludeUserId) {
			where.userId = { not: excludeUserId };
		}

		const result = await this.txHost.tx.inquiryParticipant.updateMany({
			where,
			data: {
				unreadCount: { increment: 1 },
			},
		});

		return result.count;
	}

	// ============================================================================
	// 참여/나가기
	// ============================================================================

	/**
	 * 참여 종료 (나가기)
	 */
	async markLeftById(id: string): Promise<InquiryParticipant> {
		this.logger.debug(`참여 종료: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryParticipant.update({
			where: { id },
			data: {
				leftAt: new Date(),
				isOnline: false,
				isTyping: false,
			},
		});

		return plainToInstance(InquiryParticipant, result);
	}

	// ============================================================================
	// 역할 관련
	// ============================================================================

	/**
	 * 역할 업데이트
	 */
	async updateRoleById(
		id: string,
		role: InquiryParticipantRole,
	): Promise<InquiryParticipant> {
		this.logger.debug(`역할 업데이트: ${id.slice(-8)} -> ${role}`);

		const result = await this.txHost.tx.inquiryParticipant.update({
			where: { id },
			data: { role },
		});

		return plainToInstance(InquiryParticipant, result);
	}

	/**
	 * 역할별 참여자 목록 조회
	 */
	async findManyByRole(params: {
		inquiryId: string;
		role: InquiryParticipantRole;
	}): Promise<InquiryParticipant[]> {
		const { inquiryId, role } = params;
		this.logger.debug(`역할별 참여자 조회: ${role}`);

		const results = await this.txHost.tx.inquiryParticipant.findMany({
			where: {
				inquiryId,
				role,
				leftAt: null,
			},
			include: {
				user: {
					select: { id: true, name: true, email: true },
				},
			},
		});

		return results.map((result) => plainToInstance(InquiryParticipant, result));
	}

	// ============================================================================
	// ID로 업데이트
	// ============================================================================

	/**
	 * ID로 업데이트
	 */
	async updateById(
		id: string,
		data: Prisma.InquiryParticipantUncheckedUpdateInput,
	): Promise<InquiryParticipant> {
		this.logger.debug(`참여자 업데이트: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryParticipant.update({
			where: { id },
			data,
		});

		return plainToInstance(InquiryParticipant, result);
	}
}
