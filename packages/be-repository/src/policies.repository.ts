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

	async findManyBySpaceId(spaceId: bigint): Promise<Policy[]> {
		this.logger.debug(`Policy 목록 조회: spaceId=${spaceId.toString()}`);

		const results = await this.txHost.tx.policy.findMany({
			where: {
				spaceId,
				removedAt: null,
			},
			include: this.includePolicyDetails(),
			orderBy: [{ name: "asc" }],
		});

		return results.map((result) => toDomainEntity(Policy, result));
	}

	async findByIdInSpace(id: bigint, spaceId: bigint): Promise<Policy | null> {
		this.logger.debug(
			`Policy 조회: id=${id.toString()}, spaceId=${spaceId.toString()}`,
		);

		const result = await this.txHost.tx.policy.findFirst({
			where: {
				id,
				spaceId,
				removedAt: null,
			},
			include: this.includePolicyDetails(),
		});

		return result ? toDomainEntity(Policy, result) : null;
	}

	async findByNameInSpace(
		spaceId: bigint,
		name: string,
	): Promise<Policy | null> {
		const result = await this.txHost.tx.policy.findFirst({
			where: {
				spaceId,
				name,
				removedAt: null,
			},
			include: this.includePolicyDetails(),
		});

		return result ? toDomainEntity(Policy, result) : null;
	}

	async findActivePolicyIdsInSpace(
		policyIds: bigint[],
		spaceId: bigint,
	): Promise<bigint[]> {
		if (policyIds.length === 0) return [];

		const results = await this.txHost.tx.policy.findMany({
			where: {
				id: { in: policyIds },
				spaceId,
				removedAt: null,
			},
			select: { id: true },
		});

		return results.map((policy) => policy.id);
	}

	async create(
		data: AutoIdentityCreateInput<
			Prisma.PolicyUncheckedCreateInput,
			"policyId"
		>,
	): Promise<Policy> {
		this.logger.debug(
			`Policy 생성: spaceId=${data.spaceId.toString()}, name=${data.name}`,
		);
		const result = await this.txHost.tx.policy.create({
			data,
			include: this.includePolicyDetails(),
		});

		return toDomainEntity(Policy, result);
	}

	async updateById(
		id: bigint,
		data: AutoIdentityUpdateInput<
			Prisma.PolicyUncheckedUpdateInput,
			"policyId"
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

	async removeById(id: bigint): Promise<Policy> {
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
