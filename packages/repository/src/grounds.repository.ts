import { Ground } from "@cocrepo/entity";
import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class GroundsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("GroundsRepository");
	}

	/**
	 * 모든 Ground 목록 조회
	 */
	async findAll(): Promise<Ground[]> {
		this.logger.debug("모든 Ground 목록 조회");

		const results = await this.txHost.tx.ground.findMany({
			where: { removedAt: null },
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => plainToInstance(Ground, result));
	}

	/**
	 * ID로 Ground 조회
	 */
	async findById(id: string): Promise<Ground | null> {
		this.logger.debug(`ID로 Ground 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.ground.findUnique({
			where: { id, removedAt: null },
		});

		return result ? plainToInstance(Ground, result) : null;
	}
}
