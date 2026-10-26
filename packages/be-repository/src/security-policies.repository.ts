import { SecurityPolicy } from "@cocrepo/entity";
import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class SecurityPoliciesRepository {
	private readonly logger = new Logger("SecurityPoliciesRepository");

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	/**
	 * 정책 키로 보안 정책을 조회합니다
	 */
	async findByKey(key: string): Promise<SecurityPolicy | null> {
		this.logger.debug(`키로 보안 정책 조회: ${key}`);
		const result = await this.txHost.tx.securityPolicy.findUnique({
			where: { key },
		});
		return result ? toDomainEntity(SecurityPolicy, result) : null;
	}

}
