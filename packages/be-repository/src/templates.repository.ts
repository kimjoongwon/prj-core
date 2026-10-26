import { Template } from "@cocrepo/entity";
import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class TemplatesRepository {
	private readonly logger = new Logger("TemplatesRepository");

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	/**
	 * code(unique key)로 조회 (variables 포함, 소프트 삭제 제외)
	 */
	async findByCode(code: string): Promise<Template | null> {
		this.logger.debug(`code로 조회: ${code}`);

		const result = await this.txHost.tx.template.findFirst({
			where: { code, removedAt: null },
			include: {
				variables: { include: { template: { select: { id: true } } } },
			},
		});

		return result ? toDomainEntity(Template, result) : null;
	}

}
