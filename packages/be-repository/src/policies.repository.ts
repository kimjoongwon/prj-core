import { Policy } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	AutoIdentityCreateInput,
	AutoIdentityUpdateInput,
} from "./auto-identity-input.type";
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
		this.logger.debug(`Policy 목록 조회: spaceId=${spaceId}`);

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
			`Policy 조회: id=${id}, spaceId=${spaceId}`,
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
		data: AutoIdentityCreateInput<
			Omit<Prisma.PolicyUncheckedCreateInput, "spaceSeq" | "createdBySeq">,
			"id"
		> & { spaceId: string; createdById?: string | null },
	): Promise<Policy> {
		this.logger.debug(`Policy 생성: spaceId=${data.spaceId}, name=${data.name}`);
		const { spaceId, createdById, ...rest } = data;
		const result = await this.txHost.tx.policy.create({
			data: {
				...rest,
				space: { connect: { id: spaceId } },
				...(createdById && { createdBy: { connect: { id: createdById } } }),
			} as Prisma.PolicyCreateInput,
			include: this.includePolicyDetails(),
		});

		return toDomainEntity(Policy, result);
	}

	async updateById(
		id: string,
		data: AutoIdentityUpdateInput<
			Prisma.PolicyUncheckedUpdateInput,
			"id"
		>,
	): Promise<Policy> {
		this.logger.debug(`Policy 수정: id=${id.toString()}`);
		const result = await this.txHost.tx.policy.update({
			where: { id },
			data,
			include: this.includePolicyDetails(),
		});

		return toDomainEntity(Policy, result);
	}

	async removeById(id: string): Promise<Policy> {
		this.logger.debug(`Policy 소프트 삭제: id=${id.toString()}`);

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
