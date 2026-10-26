import { Policy } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
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
