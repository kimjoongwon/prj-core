import { InquiryThread } from "@cocrepo/entity";
import { Prisma, PrismaClient, ThreadStatus } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class InquiryThreadsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("InquiryThreadsRepository");
	}

	// ============================================================================
	// 기본 CRUD
	// ============================================================================

	/**
	 * ID로 조회
	 */
	async findById(id: string): Promise<InquiryThread | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.findUnique({
			where: { id },
		});

		return result ? plainToInstance(InquiryThread, result) : null;
	}

	/**
	 * ID로 조회 (메시지 포함)
	 */
	async findByIdWithMessages(
		id: string,
		messageLimit?: number,
	): Promise<InquiryThread | null> {
		this.logger.debug(`ID로 메시지 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.findUnique({
			where: { id },
			include: {
				messages: {
					where: { isDeleted: false },
					orderBy: { createdAt: "asc" },
					take: messageLimit,
					include: {
						sender: {
							select: { id: true, name: true, email: true },
						},
						attachments: {
							where: { isDeleted: false },
						},
					},
				},
				creator: {
					select: { id: true, name: true, email: true },
				},
			},
		});

		return result ? plainToInstance(InquiryThread, result) : null;
	}

	/**
	 * 생성
	 */
	async create(
		data: Prisma.InquiryThreadUncheckedCreateInput,
	): Promise<InquiryThread> {
		this.logger.debug("스레드 생성 중...");

		const result = await this.txHost.tx.inquiryThread.create({
			data,
		});

		return plainToInstance(InquiryThread, result);
	}

	// ============================================================================
	// 조회
	// ============================================================================

	/**
	 * 문의별 스레드 목록 조회
	 */
	async findManyByInquiryId(params: {
		inquiryId: string;
		where?: Prisma.InquiryThreadWhereInput;
		orderBy?: Prisma.InquiryThreadOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryThread[]; totalCount: number }> {
		const { inquiryId, where, orderBy, skip, take } = params;
		this.logger.debug(`문의별 스레드 조회: ${inquiryId.slice(-8)}`);

		const baseWhere: Prisma.InquiryThreadWhereInput = {
			inquiryId,
			...where,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiryThread.findMany({
				where: baseWhere,
				orderBy: orderBy ?? [{ lastMessageAt: "desc" }, { createdAt: "desc" }],
				skip,
				take,
				include: {
					creator: {
						select: { id: true, name: true, email: true },
					},
				},
			}),
			this.txHost.tx.inquiryThread.count({ where: baseWhere }),
		]);

		return {
			items: items.map((item) => plainToInstance(InquiryThread, item)),
			totalCount,
		};
	}

	/**
	 * 상태별 스레드 목록 조회
	 */
	async findManyByStatus(params: {
		inquiryId: string;
		status: ThreadStatus;
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryThread[]; totalCount: number }> {
		const { inquiryId, status, skip, take } = params;
		this.logger.debug(`상태별 스레드 조회: ${status}`);

		const where: Prisma.InquiryThreadWhereInput = {
			inquiryId,
			status,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiryThread.findMany({
				where,
				orderBy: { lastMessageAt: "desc" },
				skip,
				take,
			}),
			this.txHost.tx.inquiryThread.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(InquiryThread, item)),
			totalCount,
		};
	}

	// ============================================================================
	// 상태 업데이트
	// ============================================================================

	/**
	 * 상태 업데이트
	 */
	async updateStatusById(
		id: string,
		status: ThreadStatus,
	): Promise<InquiryThread> {
		this.logger.debug(`상태 업데이트: ${id.slice(-8)} -> ${status}`);

		const updateData: Prisma.InquiryThreadUncheckedUpdateInput = { status };

		// 상태에 따른 추가 필드 업데이트
		if (status === "CLOSED") {
			updateData.closedAt = new Date();
		}

		const result = await this.txHost.tx.inquiryThread.update({
			where: { id },
			data: updateData,
		});

		return plainToInstance(InquiryThread, result);
	}

	// ============================================================================
	// 메시지 수 관련
	// ============================================================================

	/**
	 * 메시지 수 증가
	 */
	async incrementMessageCountById(id: string): Promise<InquiryThread> {
		this.logger.debug(`메시지 수 증가: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.update({
			where: { id },
			data: {
				messageCount: { increment: 1 },
				lastMessageAt: new Date(),
			},
		});

		return plainToInstance(InquiryThread, result);
	}

	/**
	 * 마지막 메시지 정보 업데이트
	 */
	async updateLastMessageById(
		id: string,
		preview: string,
	): Promise<InquiryThread> {
		this.logger.debug(`마지막 메시지 정보 업데이트: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.update({
			where: { id },
			data: {
				lastMessageAt: new Date(),
				lastMessagePreview: preview.slice(0, 100),
			},
		});

		return plainToInstance(InquiryThread, result);
	}

	// ============================================================================
	// 업데이트/삭제
	// ============================================================================

	/**
	 * ID로 업데이트
	 */
	async updateById(
		id: string,
		data: Prisma.InquiryThreadUncheckedUpdateInput,
	): Promise<InquiryThread> {
		this.logger.debug(`스레드 업데이트: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.update({
			where: { id },
			data,
		});

		return plainToInstance(InquiryThread, result);
	}

	/**
	 * 물리 삭제
	 */
	async deleteById(id: string): Promise<InquiryThread> {
		this.logger.debug(`스레드 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.delete({
			where: { id },
		});

		return plainToInstance(InquiryThread, result);
	}

	// ============================================================================
	// 통계
	// ============================================================================

	/**
	 * 문의별 스레드 수 조회
	 */
	async countByInquiryId(inquiryId: string): Promise<number> {
		this.logger.debug(`스레드 수 조회: ${inquiryId.slice(-8)}`);

		return this.txHost.tx.inquiryThread.count({
			where: { inquiryId },
		});
	}

	/**
	 * 문의별 상태별 스레드 수 조회
	 */
	async countByStatusByInquiryId(inquiryId: string): Promise<
		{
			status: ThreadStatus;
			count: number;
		}[]
	> {
		this.logger.debug(`상태별 스레드 수 조회: ${inquiryId.slice(-8)}`);

		const results = await this.txHost.tx.inquiryThread.groupBy({
			by: ["status"],
			where: { inquiryId },
			_count: {
				id: true,
			},
		});

		return results.map((result) => ({
			status: result.status,
			count: result._count.id,
		}));
	}
}
