import { SecurityPolicy } from "@cocrepo/entity";
import { type Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

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
		return result ? plainToInstance(SecurityPolicy, result) : null;
	}

	/**
	 * 보안 정책을 수정합니다
	 */
	async updateByKey(
		key: string,
		data: Prisma.SecurityPolicyUncheckedUpdateInput,
	): Promise<SecurityPolicy> {
		this.logger.debug(`보안 정책 수정: ${key}`);
		const result = await this.txHost.tx.securityPolicy.update({
			where: { key },
			data,
		});
		return plainToInstance(SecurityPolicy, result);
	}

	/**
	 * 보안 정책을 생성합니다 (시드 데이터용)
	 */
	async create(
		data: Prisma.SecurityPolicyUncheckedCreateInput,
	): Promise<SecurityPolicy> {
		this.logger.debug(`보안 정책 생성: ${data.key}`);
		const result = await this.txHost.tx.securityPolicy.create({ data });
		return plainToInstance(SecurityPolicy, result);
	}
}
