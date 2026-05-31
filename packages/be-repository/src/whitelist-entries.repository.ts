import { WhitelistEntry } from "@cocrepo/entity";
import { Prisma, PrismaClient, WhitelistType } from "@cocrepo/prisma";
import { WhitelistValue, type WhitelistValueType } from "@cocrepo/vo";
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
		const whitelistValue = WhitelistValue.create(
			type as WhitelistValueType,
			value,
		);
		this.logger.debug(`타입/값 조회: ${type}/${whitelistValue.value}`);

		const result = await this.txHost.tx.whitelistEntry.findFirst({
			where: { type, value: whitelistValue.value },
		});

		return result ? plainToInstance(WhitelistEntry, result) : null;
	}

	async findMany(params: {
		where?: Prisma.WhitelistEntryWhereInput;
		orderBy?: Prisma.WhitelistEntryOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ entries: WhitelistEntry[]; totalCount: number }> {
		const [entries, totalCount] = await Promise.all([
			this.txHost.tx.whitelistEntry.findMany({
				where: params.where,
				orderBy: params.orderBy ?? [{ createdAt: "desc" }],
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.whitelistEntry.count({ where: params.where }),
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
		const normalizedData = this.normalizeCreateData(data);
		const result = await this.txHost.tx.whitelistEntry.create({
			data: normalizedData,
		});

		return plainToInstance(WhitelistEntry, result);
	}

	async updateById(
		id: string,
		data: Prisma.WhitelistEntryUncheckedUpdateInput,
	): Promise<WhitelistEntry> {
		this.logger.debug(`ID 수정: ${id.slice(-8)}`);

		const normalizedData = await this.normalizeUpdateData(id, data);
		const result = await this.txHost.tx.whitelistEntry.update({
			where: { id },
			data: normalizedData,
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

	private normalizeCreateData(
		data: Prisma.WhitelistEntryUncheckedCreateInput,
	): Prisma.WhitelistEntryUncheckedCreateInput {
		const whitelistValue = WhitelistValue.create(
			data.type as WhitelistValueType,
			data.value,
		);
		return {
			...data,
			value: whitelistValue.value,
		};
	}

	private async normalizeUpdateData(
		id: string,
		data: Prisma.WhitelistEntryUncheckedUpdateInput,
	): Promise<Prisma.WhitelistEntryUncheckedUpdateInput> {
		const current = await this.txHost.tx.whitelistEntry.findUnique({
			where: { id },
			select: { type: true, value: true },
		});

		if (!current) {
			return data;
		}

		const nextType = this.resolveUpdateValue(data.type, current.type);
		const nextValue = this.resolveUpdateValue(data.value, current.value);
		const whitelistValue = WhitelistValue.create(
			nextType as WhitelistValueType,
			nextValue,
		);

		return {
			...data,
			value: this.applyNormalizedUpdateValue(data.value, whitelistValue.value),
		};
	}

	private resolveUpdateValue<T>(
		input: T | { set?: T } | undefined,
		current: T,
	): T {
		if (input === undefined) {
			return current;
		}

		if (typeof input === "object" && input !== null && "set" in input) {
			return input.set ?? current;
		}

		return input as T;
	}

	private applyNormalizedUpdateValue(
		input: Prisma.WhitelistEntryUncheckedUpdateInput["value"],
		value: string,
	): Prisma.WhitelistEntryUncheckedUpdateInput["value"] {
		if (typeof input === "object" && input !== null && "set" in input) {
			return { ...input, set: value };
		}

		return value;
	}
}
