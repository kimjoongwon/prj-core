import { WhitelistEntry } from "@cocrepo/entity";
import { Prisma, PrismaClient, WhitelistType } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class WhitelistEntriesRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("WhitelistEntriesRepository");
	}

	async findById(id: string): Promise<WhitelistEntry | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.whitelistEntry.findUnique({
			where: { id },
		});

		return result ? plainToInstance(WhitelistEntry, result) : null;
	}

	async findByType(type: WhitelistType): Promise<WhitelistEntry[]> {
		this.logger.debug(`타입별 조회: ${type}`);

		const result = await this.txHost.tx.whitelistEntry.findMany({
			where: { type },
			orderBy: [{ type: "asc" }, { value: "asc" }],
		});

		return result.map((item) => plainToInstance(WhitelistEntry, item));
	}

	async findByTypeAndValue(
		type: WhitelistType,
		value: string,
	): Promise<WhitelistEntry | null> {
		this.logger.debug(`타입/값 조회: ${type}/${value}`);

		const result = await this.txHost.tx.whitelistEntry.findFirst({
			where: { type, value },
		});

		return result ? plainToInstance(WhitelistEntry, result) : null;
	}

	async findMany(params: {
		where?: Prisma.WhitelistEntryWhereInput;
		orderBy?: Prisma.WhitelistEntryOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ entries: WhitelistEntry[]; totalCount: number }> {
		const { where, orderBy, skip, take } = params;

		const [entries, totalCount] = await Promise.all([
			this.txHost.tx.whitelistEntry.findMany({
				where,
				orderBy: orderBy ?? [{ createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.whitelistEntry.count({ where }),
		]);

		return {
			entries: entries.map((entry) => plainToInstance(WhitelistEntry, entry)),
			totalCount,
		};
	}

	async count(where: Prisma.WhitelistEntryWhereInput): Promise<number> {
		return this.txHost.tx.whitelistEntry.count({ where });
	}

	async create(
		data: Prisma.WhitelistEntryUncheckedCreateInput,
	): Promise<WhitelistEntry> {
		const result = await this.txHost.tx.whitelistEntry.create({
			data,
		});

		return plainToInstance(WhitelistEntry, result);
	}

	async updateById(
		id: string,
		data: Prisma.WhitelistEntryUncheckedUpdateInput,
	): Promise<WhitelistEntry> {
		this.logger.debug(`ID 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.whitelistEntry.update({
			where: { id },
			data,
		});

		return plainToInstance(WhitelistEntry, result);
	}

	async deleteById(id: string): Promise<WhitelistEntry> {
		this.logger.debug(`ID 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.whitelistEntry.delete({
			where: { id },
		});

		return plainToInstance(WhitelistEntry, result);
	}
}
