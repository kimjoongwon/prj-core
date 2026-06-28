import { TenantAccessRequest } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

const tenantAccessRequestInclude = {
	requester: true,
	reviewer: true,
	space: {
		include: {
			company: {
				include: {
					ground: true,
				},
			},
		},
	},
	requestedRole: true,
	previousRole: true,
	appliedTenant: {
		include: {
			role: true,
			space: true,
			user: true,
		},
	},
} satisfies Prisma.TenantAccessRequestInclude;

@Injectable()
export class TenantAccessRequestsRepository {
	private readonly logger = new Logger(TenantAccessRequestsRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	private toTenantAccessRequest(
		result: Prisma.TenantAccessRequestGetPayload<{
			include: typeof tenantAccessRequestInclude;
		}>,
	): TenantAccessRequest {
		const primaryGround = result.space?.company?.ground;
		if (primaryGround) {
			(result.space as unknown as { ground?: unknown }).ground =
				primaryGround;
		}

		return plainToInstance(TenantAccessRequest, result);
	}

	async findById(id: string): Promise<TenantAccessRequest | null> {
		this.logger.debug(`테넌트 접근 신청 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.tenantAccessRequest.findUnique({
			where: { id },
		});

		return result ? plainToInstance(TenantAccessRequest, result) : null;
	}

	async findByIdWithRelations(id: string): Promise<TenantAccessRequest | null> {
		this.logger.debug(`테넌트 접근 신청 상세 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.tenantAccessRequest.findUnique({
			where: { id },
			include: tenantAccessRequestInclude,
		});

		return result ? this.toTenantAccessRequest(result) : null;
	}

	async findPendingByRequesterAndSpace(
		requesterId: string,
		spaceId: string,
	): Promise<TenantAccessRequest | null> {
		this.logger.debug(
			`PENDING 신청 조회: requester=${requesterId.slice(-8)}, space=${spaceId.slice(-8)}`,
		);

		const result = await this.txHost.tx.tenantAccessRequest.findFirst({
			where: {
				requesterId,
				spaceId,
				status: "PENDING",
				removedAt: null,
			},
			include: tenantAccessRequestInclude,
		});

		return result ? plainToInstance(TenantAccessRequest, result) : null;
	}

	async findMany(params: {
		where?: Prisma.TenantAccessRequestWhereInput;
		orderBy?: Prisma.TenantAccessRequestOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: TenantAccessRequest[]; totalCount: number }> {
		this.logger.debug(
			`테넌트 접근 신청 목록 조회: skip=${params.skip ?? 0}, take=${params.take ?? "all"}`,
		);

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.tenantAccessRequest.findMany({
				where: params.where,
				include: tenantAccessRequestInclude,
				orderBy: params.orderBy ?? [{ createdAt: "desc" }],
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.tenantAccessRequest.count({ where: params.where }),
		]);

		return {
			items: items.map((item) => this.toTenantAccessRequest(item)),
			totalCount,
		};
	}

	async create(
		data: Prisma.TenantAccessRequestUncheckedCreateInput,
	): Promise<TenantAccessRequest> {
		this.logger.debug(
			`테넌트 접근 신청 생성: requester=${data.requesterId.slice(-8)}, space=${data.spaceId.slice(-8)}`,
		);

		const result = await this.txHost.tx.tenantAccessRequest.create({
			data,
			include: tenantAccessRequestInclude,
		});

		return this.toTenantAccessRequest(result);
	}

	async updateById(
		id: string,
		data: Prisma.TenantAccessRequestUncheckedUpdateInput,
	): Promise<TenantAccessRequest> {
		this.logger.debug(`테넌트 접근 신청 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.tenantAccessRequest.update({
			where: { id },
			data,
			include: tenantAccessRequestInclude,
		});

		return this.toTenantAccessRequest(result);
	}
}
