import { OidcClient } from "@cocrepo/entity";
import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class OidcClientsRepository {
	private readonly logger = new Logger("OidcClientsRepository");

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findByClientId(clientId: string): Promise<OidcClient | null> {
		this.logger.debug(`ClientID로 조회: ${clientId}`);
		const result = await this.txHost.tx.oidcClient.findUnique({
			where: { clientId },
		});
		return result ? toDomainEntity(OidcClient, result) : null;
	}
}
