import { Tenant } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";
import {
	IDP_ACCOUNT_ACCESS_GRANT_INCLUDE,
	type IdpAccountAccessGrantRecord,
} from "./idp-account-access-grant.include";

@Injectable()
export class TenantsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("TenantsRepository");
	}

	async findById(id: string): Promise<Tenant | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.tenant.findUnique({
			where: { id },
		});

		return result ? plainToInstance(Tenant, result) : null;
	}

	async findByIdWithRelations(id: string): Promise<Tenant | null> {
		this.logger.debug(`관계 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.tenant.findUnique({
			where: { id },
			include: {
				user: true,
				space: true,
				role: true,
			},
		});

		return result ? plainToInstance(Tenant, result) : null;
	}

	async findByUserId(userId: string): Promise<Tenant[]> {
		this.logger.debug(`사용자별 테넌트 조회: ${userId.slice(-8)}`);

		const result = await this.txHost.tx.tenant.findMany({
			where: { userId },
			orderBy: [{ createdAt: "desc" }],
		});

		return result.map((item) => plainToInstance(Tenant, item));
	}

	async findBySpaceId(spaceId: string): Promise<Tenant[]> {
		this.logger.debug(`Space별 테넌트 조회: ${spaceId.slice(-8)}`);

		const result = await this.txHost.tx.tenant.findMany({
			where: { spaceId },
			orderBy: [{ createdAt: "desc" }],
		});

		return result.map((item) => plainToInstance(Tenant, item));
	}

	async findByUserIdAndSpaceId(
		userId: string,
		spaceId: string,
	): Promise<Tenant | null> {
		this.logger.debug(
			`사용자+Space 결합 조회: ${userId.slice(-8)}/${spaceId.slice(-8)}`,
		);

		const result = await this.txHost.tx.tenant.findFirst({
			where: { userId, spaceId },
		});

		return result ? plainToInstance(Tenant, result) : null;
	}

	async findActiveByUserIdAndSpaceId(
		userId: string,
		spaceId: string,
	): Promise<Tenant | null> {
		this.logger.debug(
			`활성 사용자+Space 테넌트 조회: ${userId.slice(-8)}/${spaceId.slice(-8)}`,
		);

		const result = await this.txHost.tx.tenant.findFirst({
			where: { userId, spaceId, removedAt: null },
			include: { role: true, space: true, user: true },
		});

		return result ? plainToInstance(Tenant, result) : null;
	}

	async findMany(params: {
		where?: Prisma.TenantWhereInput;
		orderBy?: Prisma.TenantOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ tenants: Tenant[]; totalCount: number }> {
		const [tenants, totalCount] = await Promise.all([
			this.txHost.tx.tenant.findMany({
				where: params.where,
				orderBy: params.orderBy ?? [{ createdAt: "desc" }],
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.tenant.count({ where: params.where }),
		]);

		return {
			tenants: tenants.map((item) => plainToInstance(Tenant, item)),
			totalCount,
		};
	}

	/**
	 * Space와 Role을 포함한 테넌트 목록 projection 조회.
	 */
	async findManyWithSpaceAndRole(params: {
		where?: Prisma.TenantWhereInput;
		orderBy?: Prisma.TenantOrderByWithRelationInput[];
	}): Promise<IdpAccountAccessGrantRecord[]> {
		this.logger.debug("Space/Role 포함 테넌트 목록 조회");

		return this.txHost.tx.tenant.findMany({
			where: params.where,
			include: IDP_ACCOUNT_ACCESS_GRANT_INCLUDE,
			orderBy: params.orderBy ?? [{ createdAt: "desc" }],
		});
	}

	async create(data: Prisma.TenantUncheckedCreateInput): Promise<Tenant> {
		this.logger.debug(
			`테넌트 생성: user=${data.userId.slice(-8)}, space=${data.spaceId.slice(-8)}`,
		);

		const result = await this.txHost.tx.tenant.create({
			data,
		});

		return plainToInstance(Tenant, result);
	}

	async updateById(
		id: string,
		data: Prisma.TenantUncheckedUpdateInput,
	): Promise<Tenant> {
		this.logger.debug(`테넌트 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.tenant.update({
			where: { id },
			data,
		});

		return plainToInstance(Tenant, result);
	}

	async upsertByUserIdAndSpaceId(data: {
		userId: string;
		spaceId: string;
		roleId: string;
	}): Promise<Tenant> {
		this.logger.debug(
			`테넌트 upsert: user=${data.userId.slice(-8)}, space=${data.spaceId.slice(-8)}`,
		);

		const result = await this.txHost.tx.tenant.upsert({
			where: {
				userId_spaceId: {
					userId: data.userId,
					spaceId: data.spaceId,
				},
			},
			create: {
				userId: data.userId,
				spaceId: data.spaceId,
				roleId: data.roleId,
			},
			update: {
				roleId: data.roleId,
				removedAt: null,
			},
			include: {
				user: true,
				space: true,
				role: true,
			},
		});

		return plainToInstance(Tenant, result);
	}

	async deleteById(id: string): Promise<Tenant> {
		this.logger.debug(`테넌트 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.tenant.delete({ where: { id } });

		return plainToInstance(Tenant, result);
	}
}
