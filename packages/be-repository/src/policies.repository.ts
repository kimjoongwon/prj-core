import { Policy } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	PublicIdCreateInput,
	PublicIdUpdateInput,
} from "./public-id-input.type";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class PoliciesRepository {
	private readonly logger = new Logger(PoliciesRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findManyBySpaceId(spaceId: string): Promise<Policy[]> {
		this.logger.debug(`Policy 목록 조회: spaceId=${spaceId.slice(-8)}`);

		const results = await this.txHost.tx.policy.findMany({
			where: {
				space: { id: spaceId },
				removedAt: null,
			},
			include: this.includePolicyDetails(),
			orderBy: [{ name: "asc" }],
		});

		return results.map((result) => toDomainEntity(Policy, result));
	}

	async findByIdInSpace(id: string, spaceId: string): Promise<Policy | null> {
		this.logger.debug(
			`Policy 조회: id=${id.slice(-8)}, spaceId=${spaceId.slice(-8)}`,
		);

		const result = await this.txHost.tx.policy.findFirst({
			where: {
				id,
				space: { id: spaceId },
				removedAt: null,
			},
			include: this.includePolicyDetails(),
		});

		return result ? toDomainEntity(Policy, result) : null;
	}

	async findByNameInSpace(
		spaceId: string,
		name: string,
	): Promise<Policy | null> {
		const result = await this.txHost.tx.policy.findFirst({
			where: {
				space: { id: spaceId },
				name,
				removedAt: null,
			},
			include: this.includePolicyDetails(),
		});

		return result ? toDomainEntity(Policy, result) : null;
	}

	async findActivePolicyIdsInSpace(
		policyIds: string[],
		spaceId: string,
	): Promise<string[]> {
		if (policyIds.length === 0) return [];

		const results = await this.txHost.tx.policy.findMany({
			where: {
				id: { in: policyIds },
				space: { id: spaceId },
				removedAt: null,
			},
			select: { id: true },
		});

		return results.map((policy) => policy.id);
	}

	async create(
		data: PublicIdCreateInput<
			Prisma.PolicyUncheckedCreateInput,
			"space",
			"createdBy"
		>,
	): Promise<Policy> {
		this.logger.debug(
			`Policy 생성: spaceId=${data.spaceId.slice(-8)}, name=${data.name}`,
		);

		const { spaceId, createdById, ...policyData } = data;
		const result = await this.txHost.tx.policy.create({
			data: {
				...policyData,
				space: { connect: { id: spaceId } },
				...(createdById ? { createdBy: { connect: { id: createdById } } } : {}),
			},
			include: this.includePolicyDetails(),
		});

		return toDomainEntity(Policy, result);
	}

	async updateById(
		id: string,
		data: PublicIdUpdateInput<
			Prisma.PolicyUncheckedUpdateInput,
			"space",
			"createdBy"
		>,
	): Promise<Policy> {
		this.logger.debug(`Policy 수정: id=${id.slice(-8)}`);

		const { spaceId, createdById, ...policyData } = data;
		const result = await this.txHost.tx.policy.update({
			where: { id },
			data: {
				...policyData,
				...(spaceId !== undefined
					? { space: { connect: { id: spaceId } } }
					: {}),
				...(createdById !== undefined
					? createdById === null
						? { createdBy: { disconnect: true } }
						: { createdBy: { connect: { id: createdById } } }
					: {}),
			},
			include: this.includePolicyDetails(),
		});

		return toDomainEntity(Policy, result);
	}

	async removeById(id: string): Promise<Policy> {
		this.logger.debug(`Policy 소프트 삭제: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.policy.update({
			where: { id },
			data: { removedAt: new Date() },
			include: this.includePolicyDetails(),
		});

		return toDomainEntity(Policy, result);
	}

	private includePolicyDetails() {
		return {
			space: true,
			createdBy: true,
			entries: {
				where: { removedAt: null },
				include: {
					policy: { select: { id: true } },
					ability: {
						include: {
							subject: true,
							action: true,
						},
					},
				},
				orderBy: { createdAt: "asc" },
			},
		} satisfies Prisma.PolicyInclude;
	}
}
