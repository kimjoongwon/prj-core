import { Tenant } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	AutoIdentityCreateInput,
	AutoIdentityUpdateInput,
} from "./auto-identity-input.type";
import {
	IDP_ACCOUNT_ACCESS_GRANT_INCLUDE,
	type IdpAccountAccessGrantRecord,
} from "./idp-account-access-grant.include";
import { toDomainData, toDomainEntity } from "./to-domain-entity";

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

	async findById(id: bigint): Promise<Tenant | null> {
		this.logger.debug(`ID로 조회: ${id.toString()}`);

		const result = await this.txHost.tx.tenant.findUnique({
			where: { id },
			include: { user: true, space: true, role: true },
		});

		return result ? toDomainEntity(Tenant, result) : null;
	}

	async findByIdWithRelations(id: bigint): Promise<Tenant | null> {
		this.logger.debug(`관계 포함 조회: ${id.toString()}`);

		const result = await this.txHost.tx.tenant.findUnique({
			where: { id },
			include: {
				user: true,
				space: true,
				role: true,
			},
		});

		return result ? toDomainEntity(Tenant, result) : null;
	}

	async findByUserId(userId: bigint): Promise<Tenant[]> {
		this.logger.debug(`사용자별 테넌트 조회: ${userId.toString()}`);

		const result = await this.txHost.tx.tenant.findMany({
			where: { userId },
			include: { user: true, space: true, role: true },
			orderBy: [{ createdAt: "desc" }],
		});

		return result.map((item) => toDomainEntity(Tenant, item));
	}

	async findBySpaceId(spaceId: bigint): Promise<Tenant[]> {
		this.logger.debug(`Space별 테넌트 조회: ${spaceId.toString()}`);

		const result = await this.txHost.tx.tenant.findMany({
			where: { spaceId },
			include: { user: true, space: true, role: true },
			orderBy: [{ createdAt: "desc" }],
		});

		return result.map((item) => toDomainEntity(Tenant, item));
	}

	async findByUserIdAndSpaceId(
		userId: bigint,
		spaceId: bigint,
	): Promise<Tenant | null> {
		this.logger.debug(
			`사용자+Space 결합 조회: ${userId.toString()}/${spaceId.toString()}`,
		);

		const result = await this.txHost.tx.tenant.findFirst({
			where: { userId, spaceId },
			include: { user: true, space: true, role: true },
		});

		return result ? toDomainEntity(Tenant, result) : null;
	}

	async findActiveByUserIdAndSpaceId(
		userId: bigint,
		spaceId: bigint,
	): Promise<Tenant | null> {
		this.logger.debug(
			`활성 사용자+Space 테넌트 조회: ${userId.toString()}/${spaceId.toString()}`,
		);

		const result = await this.txHost.tx.tenant.findFirst({
			where: {
				userId,
				spaceId,
				removedAt: null,
			},
			include: { role: true, space: true, user: true },
		});

		return result ? toDomainEntity(Tenant, result) : null;
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
				include: { user: true, space: true, role: true },
			}),
			this.txHost.tx.tenant.count({ where: params.where }),
		]);

		return {
			tenants: tenants.map((item) => toDomainEntity(Tenant, item)),
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

		const results = await this.txHost.tx.tenant.findMany({
			where: params.where,
			include: IDP_ACCOUNT_ACCESS_GRANT_INCLUDE,
			orderBy: params.orderBy ?? [{ createdAt: "desc" }],
		});

		return results.map((item) => toDomainData(item));
	}

	async create(
		data: AutoIdentityCreateInput<
			Prisma.TenantUncheckedCreateInput,
			"tenantId"
		>,
	): Promise<Tenant> {
		this.logger.debug(
			`테넌트 생성: user=${data.userId.toString()}, space=${data.spaceId.toString()}`,
		);
		const result = await this.txHost.tx.tenant.create({
			data,
			include: { user: true, space: true, role: true },
		});

		return toDomainEntity(Tenant, result);
	}

	async updateById(
		id: bigint,
		data: AutoIdentityUpdateInput<
			Prisma.TenantUncheckedUpdateInput,
			"tenantId"
		>,
	): Promise<Tenant> {
		this.logger.debug(`테넌트 수정: ${id.toString()}`);
		const result = await this.txHost.tx.tenant.update({
			where: { id },
			data,
			include: { user: true, space: true, role: true },
		});

		return toDomainEntity(Tenant, result);
	}

	async upsertByUserIdAndSpaceId(data: {
		userId: bigint;
		spaceId: bigint;
		roleId: bigint;
	}): Promise<Tenant> {
		this.logger.debug(
			`테넌트 upsert: user=${data.userId.toString()}, space=${data.spaceId.toString()}`,
		);

		const existing = await this.txHost.tx.tenant.findFirst({
			where: {
				userId: data.userId,
				spaceId: data.spaceId,
			},
			select: { id: true },
		});
		const result = existing
			? await this.txHost.tx.tenant.update({
					where: { id: existing.id },
					data: {
						roleId: data.roleId,
						removedAt: null,
					},
					include: { user: true, space: true, role: true },
				})
			: await this.txHost.tx.tenant.create({
					data: {
						userId: data.userId,
						spaceId: data.spaceId,
						roleId: data.roleId,
					},
					include: { user: true, space: true, role: true },
				});

		return toDomainEntity(Tenant, result);
	}

	async deleteById(id: bigint): Promise<Tenant> {
		this.logger.debug(`테넌트 삭제: ${id.toString()}`);

		const result = await this.txHost.tx.tenant.delete({
			where: { id },
			include: { user: true, space: true, role: true },
		});

		return toDomainEntity(Tenant, result);
	}
}
