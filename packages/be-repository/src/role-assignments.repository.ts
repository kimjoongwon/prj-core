import { RoleAssignment } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

export interface RoleAssignmentInput {
	policyId: string;
	isActive?: boolean;
	priority?: number;
}

@Injectable()
export class RoleAssignmentsRepository {
	private readonly logger = new Logger(RoleAssignmentsRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findByRoleIdInSpace(
		roleId: string,
		spaceId: string,
	): Promise<RoleAssignment[]> {
		const results = await this.txHost.tx.roleAssignment.findMany({
			where: this.buildRoleAssignmentWhere([roleId], spaceId),
			include: this.includePolicyEntries(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(RoleAssignment, result));
	}

	async findActiveByRoleIdsInSpace(
		roleIds: string[],
		spaceId: string,
	): Promise<RoleAssignment[]> {
		if (roleIds.length === 0) return [];

		const results = await this.txHost.tx.roleAssignment.findMany({
			where: {
				...this.buildRoleAssignmentWhere(roleIds, spaceId),
				isActive: true,
			},
			include: this.includePolicyEntries(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(RoleAssignment, result));
	}

	async syncByRoleId(
		roleId: string,
		items: RoleAssignmentInput[],
		spaceId: string,
	): Promise<RoleAssignment[]> {
		this.logger.debug(
			`RoleAssignment 동기화: roleId=${roleId.slice(-8)}, count=${items.length}`,
		);

		const uniqueItems = this.dedupeByPolicyId(items);
		const policyIds = uniqueItems.map((item) => item.policyId);

		await this.softRemoveMissing(roleId, policyIds, spaceId);

		await Promise.all(
			uniqueItems.map((item) =>
				this.txHost.tx.roleAssignment.upsert({
					where: {
						roleId_policyId: {
							roleId,
							policyId: item.policyId,
						},
					},
					create: {
						roleId,
						policyId: item.policyId,
						isActive: item.isActive ?? true,
						priority: item.priority ?? 0,
					},
					update: {
						isActive: item.isActive ?? true,
						priority: item.priority ?? 0,
						removedAt: null,
					},
				}),
			),
		);

		const synced = await this.txHost.tx.roleAssignment.findMany({
			where: {
				roleId,
				policyId: { in: policyIds },
				removedAt: null,
				policy: {
					spaceId,
					removedAt: null,
				},
			},
			include: this.includePolicyEntries(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return synced.map((result) => plainToInstance(RoleAssignment, result));
	}

	async removeByPolicyId(policyId: string): Promise<number> {
		const result = await this.txHost.tx.roleAssignment.updateMany({
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

	private buildRoleAssignmentWhere(roleIds: string[], spaceId: string) {
		return {
			roleId: { in: roleIds },
			removedAt: null,
			policy: {
				spaceId,
				removedAt: null,
			},
		} satisfies Prisma.RoleAssignmentWhereInput;
	}

	private async softRemoveMissing(
		roleId: string,
		policyIds: string[],
		spaceId: string,
	): Promise<void> {
		await this.txHost.tx.roleAssignment.updateMany({
			where: {
				roleId,
				removedAt: null,
				policy: {
					spaceId,
					removedAt: null,
				},
				...(policyIds.length > 0 ? { policyId: { notIn: policyIds } } : {}),
			},
			data: {
				removedAt: new Date(),
			},
		});
	}

	private dedupeByPolicyId(
		items: RoleAssignmentInput[],
	): RoleAssignmentInput[] {
		return Array.from(
			new Map(items.map((item) => [item.policyId, item])).values(),
		);
	}

	private includePolicyEntries() {
		return {
			policy: {
				include: {
					entries: {
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
		} satisfies Prisma.RoleAssignmentInclude;
	}
}
