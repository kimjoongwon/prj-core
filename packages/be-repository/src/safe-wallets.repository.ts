import type { DomainData } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	AutoIdentityCreateInput,
	AutoIdentityUpdateInput,
} from "./auto-identity-input.type";
import { toDomainData } from "./to-domain-entity";

const safeWalletInclude = {
	space: true,
	createdBy: true,
} satisfies Prisma.SafeWalletInclude;

type SafeWalletPersistenceRecord = Prisma.SafeWalletGetPayload<{
	include: typeof safeWalletInclude;
}>;

type SafeWalletRecord = DomainData<SafeWalletPersistenceRecord>;

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

	async findById(id: bigint): Promise<SafeWalletRecord | null> {
		this.logger.debug(`ID로 조회: ${id.toString()}`);

		const result = await this.txHost.tx.safeWallet.findUnique({
			where: { id },
			include: safeWalletInclude,
		});

		return result ? toDomainData(result) : null;
	}

	async findByIdWithTransactions(id: string): Promise<SafeWalletRecord | null> {
		this.logger.debug(`트랜잭션 포함 조회: ${id.toString()}`);

		const result = await this.txHost.tx.safeWallet.findUnique({
			where: { safeWalletId: id },
			include: {
				transactions: {
					orderBy: [{ createdAt: "desc" }],
					include: { confirmations: true },
				},
				...safeWalletInclude,
			},
		});

		return result ? toDomainData(result) : null;
	}

	async findByAddress(address: string): Promise<SafeWalletRecord | null> {
		this.logger.debug(`주소로 조회: ${address}`);

		const result = await this.txHost.tx.safeWallet.findUnique({
			where: { address },
			include: { space: true, createdBy: true },
		});

		return result ? (toDomainData(result) as SafeWalletRecord) : null;
	}

	async findBySpaceId(spaceId: bigint): Promise<SafeWalletRecord[]> {
		this.logger.debug(`Space별 지갑 조회: ${spaceId.toString()}`);

		const results = await this.txHost.tx.safeWallet.findMany({
			where: { spaceId, removedAt: null },
			include: safeWalletInclude,
			orderBy: [{ createdAt: "desc" }],
		});

		return results.map((result) => toDomainData(result));
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
				include: safeWalletInclude,
			}),
			this.txHost.tx.safeWallet.count({ where: params.where }),
		]);

		return {
			wallets: wallets.map((wallet) => toDomainData(wallet)),
			totalCount,
		};
	}

	async create(
		data: AutoIdentityCreateInput<
			Prisma.SafeWalletUncheckedCreateInput,
			"safeWalletId"
		>,
	): Promise<SafeWalletRecord> {
		this.logger.debug(`지갑 생성: ${data.address}`);
		const result = await this.txHost.tx.safeWallet.create({
			data,
			include: safeWalletInclude,
		});

		return toDomainData(result);
	}

	async updateById(
		id: bigint,
		data: AutoIdentityUpdateInput<
			Prisma.SafeWalletUncheckedUpdateInput,
			"safeWalletId"
		>,
	): Promise<SafeWalletRecord> {
		this.logger.debug(`지갑 수정: ${id.toString()}`);
		const result = await this.txHost.tx.safeWallet.update({
			where: { id },
			data,
			include: safeWalletInclude,
		});

		return toDomainData(result);
	}

	async removeById(id: bigint): Promise<SafeWalletRecord> {
		this.logger.debug(`지갑 삭제: ${id.toString()}`);

		const result = await this.txHost.tx.safeWallet.delete({
			where: { id },
			include: safeWalletInclude,
		});

		return toDomainData(result);
	}
}
