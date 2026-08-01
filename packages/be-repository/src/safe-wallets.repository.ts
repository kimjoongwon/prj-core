import type { DomainData } from "@cocrepo/entity";
import { Prisma, PrismaClient, SafeWallet } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	PublicIdCreateInput,
	PublicIdUpdateInput,
} from "./public-id-input.type";
import { toDomainData } from "./to-domain-entity";

type SafeWalletRecord = DomainData<SafeWallet> & {
	spaceId: string;
	createdById: string | null;
};

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

	async findById(id: string): Promise<SafeWalletRecord | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.safeWallet.findUnique({
			where: { id },
			include: { space: true, createdBy: true },
		});

		return result ? (toDomainData(result) as SafeWalletRecord) : null;
	}

	async findByIdWithTransactions(id: string): Promise<SafeWalletRecord | null> {
		this.logger.debug(`트랜잭션 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.safeWallet.findUnique({
			where: { id },
			include: {
				transactions: {
					orderBy: [{ createdAt: "desc" }],
					include: { confirmations: true },
				},
				space: true,
				createdBy: true,
			},
		});

		return result ? (toDomainData(result) as SafeWalletRecord) : null;
	}

	async findByAddress(address: string): Promise<SafeWalletRecord | null> {
		this.logger.debug(`주소로 조회: ${address}`);

		const result = await this.txHost.tx.safeWallet.findUnique({
			where: { address },
			include: { space: true, createdBy: true },
		});

		return result ? (toDomainData(result) as SafeWalletRecord) : null;
	}

	async findBySpaceId(spaceId: string): Promise<SafeWalletRecord[]> {
		this.logger.debug(`Space별 지갑 조회: ${spaceId.slice(-8)}`);

		const results = await this.txHost.tx.safeWallet.findMany({
			where: { space: { id: spaceId }, removedAt: null },
			include: { space: true, createdBy: true },
			orderBy: [{ createdAt: "desc" }],
		});

		return toDomainData(results) as SafeWalletRecord[];
	}

	async findMany(params: {
		where?: Prisma.SafeWalletWhereInput;
		orderBy?: Prisma.SafeWalletOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ wallets: SafeWalletRecord[]; totalCount: number }> {
		const [wallets, totalCount] = await Promise.all([
			this.txHost.tx.safeWallet.findMany({
				where: params.where,
				orderBy: params.orderBy ?? [{ createdAt: "desc" }],
				skip: params.skip,
				take: params.take,
				include: { space: true, createdBy: true },
			}),
			this.txHost.tx.safeWallet.count({ where: params.where }),
		]);

		return {
			wallets: toDomainData(wallets) as SafeWalletRecord[],
			totalCount,
		};
	}

	async create(
		data: PublicIdCreateInput<
			Prisma.SafeWalletUncheckedCreateInput,
			"space",
			"createdBy"
		>,
	): Promise<SafeWalletRecord> {
		this.logger.debug(`지갑 생성: ${data.address}`);

		const { spaceId, createdById, ...walletData } = data;
		const result = await this.txHost.tx.safeWallet.create({
			data: {
				...walletData,
				space: { connect: { id: spaceId } },
				...(createdById ? { createdBy: { connect: { id: createdById } } } : {}),
			},
			include: { space: true, createdBy: true },
		});

		return toDomainData(result) as SafeWalletRecord;
	}

	async updateById(
		id: string,
		data: PublicIdUpdateInput<
			Prisma.SafeWalletUncheckedUpdateInput,
			"space",
			"createdBy"
		>,
	): Promise<SafeWalletRecord> {
		this.logger.debug(`지갑 수정: ${id.slice(-8)}`);

		const { spaceId, createdById, ...walletData } = data;
		const result = await this.txHost.tx.safeWallet.update({
			where: { id },
			data: {
				...walletData,
				...(spaceId !== undefined
					? { space: { connect: { id: spaceId } } }
					: {}),
				...(createdById !== undefined
					? createdById === null
						? { createdBy: { disconnect: true } }
						: { createdBy: { connect: { id: createdById } } }
					: {}),
			},
			include: { space: true, createdBy: true },
		});

		return toDomainData(result) as SafeWalletRecord;
	}

	async removeById(id: string): Promise<SafeWalletRecord> {
		this.logger.debug(`지갑 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.safeWallet.delete({
			where: { id },
			include: { space: true, createdBy: true },
		});

		return toDomainData(result) as SafeWalletRecord;
	}
}
