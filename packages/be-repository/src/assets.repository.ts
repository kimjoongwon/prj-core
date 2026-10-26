import { Asset } from "@cocrepo/entity";
import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class AssetsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("AssetsRepository");
	}

	async findByIdWithRelations(id: string): Promise<Asset | null> {
		this.logger.debug(`관계 포함 조회: ${id.toString()}`);

		const result = await this.txHost.tx.asset.findUnique({
			where: { id },
			include: {
				image: true,
				video: true,
				document: true,
				folder: true,
				space: true,
				createdBy: true,
			},
		});

		return result ? toDomainEntity(Asset, result) : null;
	}

}
