import { PasswordHistory } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type { AutoIdentityCreateInput } from "./auto-identity-input.type";
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

	async findById(id: bigint): Promise<PasswordHistory | null> {
		this.logger.debug(`ID로 조회: ${id.toString()}`);

		const result = await this.txHost.tx.passwordHistory.findUnique({
			where: { id },
			include: { user: true },
		});

		return result ? toDomainEntity(PasswordHistory, result) : null;
	}

	async findByUserId(userId: bigint): Promise<PasswordHistory[]> {
		this.logger.debug(`사용자별 이력 조회: ${userId.toString()}`);

		const result = await this.txHost.tx.passwordHistory.findMany({
			where: { userId },
			include: { user: true },
			orderBy: [{ createdAt: "desc" }],
		});

		return result.map((item) => toDomainEntity(PasswordHistory, item));
	}

	async findLatestByUserId(userId: bigint): Promise<PasswordHistory | null> {
		this.logger.debug(`최신 이력 조회: ${userId.toString()}`);

		const result = await this.txHost.tx.passwordHistory.findFirst({
			where: { userId },
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
		data: AutoIdentityCreateInput<
			Prisma.PasswordHistoryUncheckedCreateInput,
			"passwordHistoryId"
		>,
	): Promise<PasswordHistory> {
		this.logger.debug(`생성: ${data.userId.toString()}`);
		const result = await this.txHost.tx.passwordHistory.create({
			data,
			include: { user: true },
		});

		return toDomainEntity(PasswordHistory, result);
	}

	async deleteById(id: bigint): Promise<PasswordHistory> {
		this.logger.debug(`ID 삭제: ${id.toString()}`);

		const result = await this.txHost.tx.passwordHistory.delete({
			where: { id },
			include: { user: true },
		});

		return toDomainEntity(PasswordHistory, result);
	}

	async deleteByUserId(userId: bigint): Promise<{ count: number }> {
		this.logger.debug(`사용자별 이력 전체 삭제: ${userId.toString()}`);

		const result = await this.txHost.tx.passwordHistory.deleteMany({
			where: { userId },
		});

		return result;
	}
}
