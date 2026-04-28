import { UserPolicy } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";
import type { PolicyAssignmentInput } from "./role-policies.repository";

@Injectable()
export class UserPoliciesRepository {
	private readonly logger = new Logger(UserPoliciesRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findByUserIdInSpace(
		userId: string,
		spaceId: string,
	): Promise<UserPolicy[]> {
		const results = await this.txHost.tx.userPolicy.findMany({
			where: this.buildUserPolicyWhere(userId, spaceId),
			include: this.includePolicyAbilities(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(UserPolicy, result));
	}

	async findActiveByUserIdInSpace(
		userId: string,
		spaceId: string,
	): Promise<UserPolicy[]> {
		const results = await this.txHost.tx.userPolicy.findMany({
			where: {
				...this.buildUserPolicyWhere(userId, spaceId),
				isActive: true,
			},
			include: this.includePolicyAbilities(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(UserPolicy, result));
	}

	async syncByUserId(
		userId: string,
		items: PolicyAssignmentInput[],
		spaceId: string,
	): Promise<UserPolicy[]> {
		this.logger.debug(
			`UserPolicy 동기화: userId=${userId.slice(-8)}, count=${items.length}`,
		);

		const uniqueItems = this.dedupeByPolicyId(items);
		const policyIds = uniqueItems.map((item) => item.policyId);

		await this.softRemoveMissing(userId, policyIds, spaceId);

		await Promise.all(
			uniqueItems.map((item) =>
				this.txHost.tx.userPolicy.upsert({
					where: {
						userId_policyId: {
							userId,
							policyId: item.policyId,
						},
					},
					create: {
						userId,
						policyId: item.policyId,
						isActive: item.isActive ?? true,
						priority: item.priority ?? 10,
					},
					update: {
						isActive: item.isActive ?? true,
						priority: item.priority ?? 10,
						removedAt: null,
					},
				}),
			),
		);

		const synced = await this.txHost.tx.userPolicy.findMany({
			where: {
				userId,
				policyId: { in: policyIds },
				removedAt: null,
				policy: {
					spaceId,
					removedAt: null,
				},
			},
			include: this.includePolicyAbilities(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return synced.map((result) => plainToInstance(UserPolicy, result));
	}

	async removeByPolicyId(policyId: string): Promise<number> {
		const result = await this.txHost.tx.userPolicy.updateMany({
			where: {
				policyId,
				removedAt: null,
			},
			data: {
				removedAt: new Date(),
			},
		});

		return result.count;
	}

	private buildUserPolicyWhere(userId: string, spaceId: string) {
		return {
			userId,
			removedAt: null,
			policy: {
				spaceId,
				removedAt: null,
			},
		} satisfies Prisma.UserPolicyWhereInput;
	}

	private async softRemoveMissing(
		userId: string,
		policyIds: string[],
		spaceId: string,
	): Promise<void> {
		await this.txHost.tx.userPolicy.updateMany({
			where: {
				userId,
				removedAt: null,
				policy: {
					spaceId,
					removedAt: null,
				},
				...(policyIds.length > 0
					? { policyId: { notIn: policyIds } }
					: {}),
			},
			data: {
				removedAt: new Date(),
			},
		});
	}

	private dedupeByPolicyId(
		items: PolicyAssignmentInput[],
	): PolicyAssignmentInput[] {
		return Array.from(
			new Map(items.map((item) => [item.policyId, item])).values(),
		);
	}

	private includePolicyAbilities() {
		return {
			policy: {
				include: {
					policyAbilities: {
						where: {
							removedAt: null,
							ability: { removedAt: null },
						},
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
				},
			},
		} satisfies Prisma.UserPolicyInclude;
	}
}
