import { Prisma, PrismaClient, SafeWallet } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

@Injectable()
export class SafeWalletsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("SafeWalletsRepository");
	}

	async findById(id: string): Promise<SafeWallet | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.safeWallet.findUnique({ where: { id } });

		return result;
	}

	async findByIdWithTransactions(id: string): Promise<SafeWallet | null> {
		this.logger.debug(`트랜잭션 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.safeWallet.findUnique({
			where: { id },
			include: {
				transactions: {
					orderBy: [{ createdAt: "desc" }],
					include: { confirmations: true },
				},
				space: true,
				creator: true,
			},
		});

		return result;
	}

	async findByAddress(address: string): Promise<SafeWallet | null> {
		this.logger.debug(`주소로 조회: ${address}`);

		const result = await this.txHost.tx.safeWallet.findUnique({
			where: { address },
		});

		return result;
	}

	async findBySpaceId(spaceId: string): Promise<SafeWallet[]> {
		this.logger.debug(`Space별 지갑 조회: ${spaceId.slice(-8)}`);

		return this.txHost.tx.safeWallet.findMany({
			where: { spaceId, removedAt: null },
			orderBy: [{ createdAt: "desc" }],
		});
	}

	async findMany(params: {
		where?: Prisma.SafeWalletWhereInput;
		orderBy?: Prisma.SafeWalletOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ wallets: SafeWallet[]; totalCount: number }> {
		const { where, orderBy, skip, take } = params;
		const [wallets, totalCount] = await Promise.all([
			this.txHost.tx.safeWallet.findMany({
				where,
				orderBy: orderBy ?? [{ createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.safeWallet.count({ where }),
		]);

		return { wallets, totalCount };
	}

	async create(data: Prisma.SafeWalletUncheckedCreateInput): Promise<SafeWallet> {
		this.logger.debug(`지갑 생성: ${data.address}`);

		const result = await this.txHost.tx.safeWallet.create({ data });

		return result;
	}

	async updateById(
		id: string,
		data: Prisma.SafeWalletUncheckedUpdateInput,
	): Promise<SafeWallet> {
		this.logger.debug(`지갑 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.safeWallet.update({
			where: { id },
			data,
		});

		return result;
	}

	async removeById(id: string): Promise<SafeWallet> {
		this.logger.debug(`지갑 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.safeWallet.delete({ where: { id } });

		return result;
	}
}

