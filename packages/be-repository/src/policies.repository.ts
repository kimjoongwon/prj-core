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

	async findManyBySpaceId(spaceSeq: bigint): Promise<Policy[]> {
		this.logger.debug(`Policy 목록 조회: spaceSeq=${spaceSeq.toString()}`);

		const results = await this.txHost.tx.policy.findMany({
			where: {
				spaceSeq,
				removedAt: null,
			},
			include: this.includePolicyDetails(),
			orderBy: [{ name: "asc" }],
		});

		return results.map((result) => toDomainEntity(Policy, result));
	}

	async findByIdInSpace(id: bigint, spaceSeq: bigint): Promise<Policy | null> {
		this.logger.debug(
			`Policy 조회: id=${id.toString()}, spaceSeq=${spaceSeq.toString()}`,
		);

		const result = await this.txHost.tx.policy.findFirst({
			where: {
				seq: id,
				spaceSeq,
				removedAt: null,
			},
			include: this.includePolicyDetails(),
		});

		return result ? toDomainEntity(Policy, result) : null;
	}

	async findByNameInSpace(
		spaceSeq: bigint,
		name: string,
	): Promise<Policy | null> {
		const result = await this.txHost.tx.policy.findFirst({
			where: {
				spaceSeq,
				name,
				removedAt: null,
			},
			include: this.includePolicyDetails(),
		});

		return result ? toDomainEntity(Policy, result) : null;
	}

	async findActivePolicyIdsInSpace(
		policyIds: bigint[],
		spaceSeq: bigint,
	): Promise<bigint[]> {
		if (policyIds.length === 0) return [];

		const results = await this.txHost.tx.policy.findMany({
			where: {
				seq: { in: policyIds },
				spaceSeq,
				removedAt: null,
			},
			select: { seq: true },
		});

		return results.map((policy) => policy.seq);
	}

	async create(
		data: AutoIdentityCreateInput<
			Prisma.PolicyUncheckedCreateInput,
			"id"
		>,
	): Promise<Policy> {
		this.logger.debug(
			`Policy 생성: spaceSeq=${data.spaceSeq.toString()}, name=${data.name}`,
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
			"id"
		>,
	): Promise<Policy> {
		this.logger.debug(`Policy 수정: id=${id.toString()}`);
		const result = await this.txHost.tx.policy.update({
			where: { seq: id },
			data,
			include: this.includePolicyDetails(),
		});

		return toDomainEntity(Policy, result);
	}

	async removeById(id: bigint): Promise<Policy> {
		this.logger.debug(`Policy 소프트 삭제: id=${id.toString()}`);

		const result = await this.txHost.tx.policy.update({
			where: { seq: id },
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
