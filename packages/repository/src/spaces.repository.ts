import { PrismaClient, Prisma, Space } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

@Injectable()
export class SpacesRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("SpacesRepository");
	}

	/**
	 * ID로 Space 조회
	 */
	async findById(id: string): Promise<Space | null> {
		this.logger.debug(`ID로 Space 조회: ${id.slice(-8)}`);

		return this.txHost.tx.space.findUnique({
			where: { id },
		});
	}

	/**
	 * Space 생성
	 */
	async create(data?: Prisma.SpaceUncheckedCreateInput): Promise<Space> {
		this.logger.debug("Space 생성");

		return this.txHost.tx.space.create({
			data: data ?? {},
		});
	}

	/**
	 * ID로 Space 삭제 (Soft Delete)
	 */
	async removeById(id: string): Promise<Space> {
		this.logger.debug(`Space 삭제 (Soft Delete): ${id.slice(-8)}`);

		return this.txHost.tx.space.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}
}
