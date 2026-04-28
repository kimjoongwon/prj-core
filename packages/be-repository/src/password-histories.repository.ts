import { PasswordHistory } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

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
		});

		return result ? plainToInstance(PasswordHistory, result) : null;
	}

	async findByUserId(userId: string): Promise<PasswordHistory[]> {
		this.logger.debug(`사용자별 이력 조회: ${userId.slice(-8)}`);

		const result = await this.txHost.tx.passwordHistory.findMany({
			where: { userId },
			orderBy: [{ createdAt: "desc" }],
		});

		return result.map((item) => plainToInstance(PasswordHistory, item));
	}

	async findLatestByUserId(userId: string): Promise<PasswordHistory | null> {
		this.logger.debug(`최신 이력 조회: ${userId.slice(-8)}`);

		const result = await this.txHost.tx.passwordHistory.findFirst({
			where: { userId },
			orderBy: [{ createdAt: "desc" }],
		});

		return result ? plainToInstance(PasswordHistory, result) : null;
	}

	async findMany(params: {
		where?: Prisma.PasswordHistoryWhereInput;
		orderBy?: Prisma.PasswordHistoryOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: PasswordHistory[]; totalCount: number }> {
		const { where, orderBy, skip, take } = params;

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.passwordHistory.findMany({
				where,
				orderBy: orderBy ?? [{ createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.passwordHistory.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(PasswordHistory, item)),
			totalCount,
		};
	}

	async create(
		data: Prisma.PasswordHistoryUncheckedCreateInput,
	): Promise<PasswordHistory> {
		this.logger.debug(`생성: ${data.userId.slice(-8)}`);

		const result = await this.txHost.tx.passwordHistory.create({
			data,
		});

		return plainToInstance(PasswordHistory, result);
	}

	async deleteById(id: string): Promise<PasswordHistory> {
		this.logger.debug(`ID 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.passwordHistory.delete({
			where: { id },
		});

		return plainToInstance(PasswordHistory, result);
	}

	async deleteByUserId(userId: string): Promise<{ count: number }> {
		this.logger.debug(`사용자별 이력 전체 삭제: ${userId.slice(-8)}`);

		const result = await this.txHost.tx.passwordHistory.deleteMany({
			where: { userId },
		});

		return result;
	}
}
