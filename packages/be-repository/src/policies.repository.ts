import { Policy } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

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
				spaceId,
				removedAt: null,
			},
			include: this.includePolicyDetails(),
			orderBy: [{ isSystem: "desc" }, { name: "asc" }],
		});

		return results.map((result) => plainToInstance(Policy, result));
	}

	async findByIdInSpace(id: string, spaceId: string): Promise<Policy | null> {
		this.logger.debug(
			`Policy 조회: id=${id.slice(-8)}, spaceId=${spaceId.slice(-8)}`,
		);

		const result = await this.txHost.tx.policy.findFirst({
			where: {
				id,
				spaceId,
				removedAt: null,
			},
			include: this.includePolicyDetails(),
		});

		return result ? plainToInstance(Policy, result) : null;
	}

	async findByNameInSpace(
		spaceId: string,
		name: string,
	): Promise<Policy | null> {
		const result = await this.txHost.tx.policy.findFirst({
			where: {
				spaceId,
				name,
				removedAt: null,
			},
		});

		return result ? plainToInstance(Policy, result) : null;
	}

	async findActivePolicyIdsInSpace(
		policyIds: string[],
		spaceId: string,
	): Promise<string[]> {
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

	async create(data: Prisma.PolicyUncheckedCreateInput): Promise<Policy> {
		this.logger.debug(
			`Policy 생성: spaceId=${data.spaceId.slice(-8)}, name=${data.name}`,
		);

		const result = await this.txHost.tx.policy.create({
			data,
			include: this.includePolicyDetails(),
		});

		return plainToInstance(Policy, result);
	}

	async updateById(
		id: string,
		data: Prisma.PolicyUncheckedUpdateInput,
	): Promise<Policy> {
		this.logger.debug(`Policy 수정: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.policy.update({
			where: { id },
			data,
			include: this.includePolicyDetails(),
		});

		return plainToInstance(Policy, result);
	}

	async removeById(id: string): Promise<Policy> {
		this.logger.debug(`Policy 소프트 삭제: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.policy.update({
			where: { id },
			data: { removedAt: new Date() },
			include: this.includePolicyDetails(),
		});

		return plainToInstance(Policy, result);
	}

	private includePolicyDetails() {
		return {
			policyAbilities: {
				where: { removedAt: null },
				include: {
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
