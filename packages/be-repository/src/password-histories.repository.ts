import { PasswordHistory } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type { PublicIdCreateInput } from "./public-id-input.type";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class PasswordHistoriesRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("PasswordHistoriesRepository");
	}

	async findById(id: string): Promise<PasswordHistory | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.passwordHistory.findUnique({
			where: { id },
			include: { user: true },
		});

		return result ? toDomainEntity(PasswordHistory, result) : null;
	}

	async findByUserId(userId: string): Promise<PasswordHistory[]> {
		this.logger.debug(`사용자별 이력 조회: ${userId.slice(-8)}`);

		const result = await this.txHost.tx.passwordHistory.findMany({
			where: { user: { id: userId } },
			include: { user: true },
			orderBy: [{ createdAt: "desc" }],
		});

		return result.map((item) => toDomainEntity(PasswordHistory, item));
	}

	async findLatestByUserId(userId: string): Promise<PasswordHistory | null> {
		this.logger.debug(`최신 이력 조회: ${userId.slice(-8)}`);

		const result = await this.txHost.tx.passwordHistory.findFirst({
			where: { user: { id: userId } },
			include: { user: true },
			orderBy: [{ createdAt: "desc" }],
		});

		return result ? toDomainEntity(PasswordHistory, result) : null;
	}

	async findMany(params: {
		where?: Prisma.PasswordHistoryWhereInput;
		orderBy?: Prisma.PasswordHistoryOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: PasswordHistory[]; totalCount: number }> {
		const [items, totalCount] = await Promise.all([
			this.txHost.tx.passwordHistory.findMany({
				where: params.where,
				orderBy: params.orderBy ?? [{ createdAt: "desc" }],
				skip: params.skip,
				take: params.take,
				include: { user: true },
			}),
			this.txHost.tx.passwordHistory.count({ where: params.where }),
		]);

		return {
			items: items.map((item) => toDomainEntity(PasswordHistory, item)),
			totalCount,
		};
	}

	async create(
		data: PublicIdCreateInput<
			Prisma.PasswordHistoryUncheckedCreateInput,
			"user"
		>,
	): Promise<PasswordHistory> {
		this.logger.debug(`생성: ${data.userId.slice(-8)}`);

		const { userId, ...historyData } = data;
		const result = await this.txHost.tx.passwordHistory.create({
			data: {
				...historyData,
				user: { connect: { id: userId } },
			},
			include: { user: true },
		});

		return toDomainEntity(PasswordHistory, result);
	}

	async deleteById(id: string): Promise<PasswordHistory> {
		this.logger.debug(`ID 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.passwordHistory.delete({
			where: { id },
			include: { user: true },
		});

		return toDomainEntity(PasswordHistory, result);
	}

	async deleteByUserId(userId: string): Promise<{ count: number }> {
		this.logger.debug(`사용자별 이력 전체 삭제: ${userId.slice(-8)}`);

		const result = await this.txHost.tx.passwordHistory.deleteMany({
			where: { user: { id: userId } },
		});

		return result;
	}
}
