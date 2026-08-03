import { RoleAssignment } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

export interface RoleAssignmentInput {
	policyId: bigint;
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
		roleId: bigint,
		spaceId: bigint,
	): Promise<RoleAssignment[]> {
		const results = await this.txHost.tx.roleAssignment.findMany({
			where: this.buildRoleAssignmentWhere([roleId], spaceId),
			include: this.includePolicyEntries(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => toDomainEntity(RoleAssignment, result));
	}

	async findActiveByRoleIdsInSpace(
		roleIds: bigint[],
		spaceId: bigint,
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

		return results.map((result) => toDomainEntity(RoleAssignment, result));
	}

	async syncByRoleId(
		roleId: bigint,
		items: RoleAssignmentInput[],
		spaceId: bigint,
	): Promise<RoleAssignment[]> {
		this.logger.debug(
			`RoleAssignment 동기화: roleId=${roleId.toString()}, count=${items.length}`,
		);

		const uniqueItems = this.dedupeByPolicyId(items);
		const policyIds = uniqueItems.map((item) => item.policyId);

		await this.softRemoveMissing(roleId, policyIds, spaceId);

		await Promise.all(
			uniqueItems.map(async (item) => {
				const existing = await this.txHost.tx.roleAssignment.findFirst({
					where: {
						roleId,
						policyId: item.policyId,
					},
					select: { id: true },
				});
				const assignmentData = {
					isActive: item.isActive ?? true,
					priority: item.priority ?? 0,
					removedAt: null,
				};

				if (existing) {
					await this.txHost.tx.roleAssignment.update({
						where: { id: existing.id },
						data: assignmentData,
					});
					return;
				}

				await this.txHost.tx.roleAssignment.create({
					data: {
						...assignmentData,
						roleId,
						policyId: item.policyId,
					},
				});
			}),
		);

		const synced = await this.txHost.tx.roleAssignment.findMany({
			where: {
				roleId,
				policy: {
					id: { in: policyIds },
					space: { id: spaceId },
					removedAt: null,
				},
				removedAt: null,
			},
			include: this.includePolicyEntries(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return synced.map((result) => toDomainEntity(RoleAssignment, result));
	}

	async removeByPolicyId(policyId: bigint): Promise<number> {
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

	private buildRoleAssignmentWhere(roleIds: bigint[], spaceId: bigint) {
		return {
			roleId: { in: roleIds },
			removedAt: null,
			policy: {
				space: { id: spaceId },
				removedAt: null,
			},
		} satisfies Prisma.RoleAssignmentWhereInput;
	}

	private async softRemoveMissing(
		roleId: bigint,
		policyIds: bigint[],
		spaceId: bigint,
	): Promise<void> {
		await this.txHost.tx.roleAssignment.updateMany({
			where: {
				roleId,
				removedAt: null,
				policy: {
					space: { id: spaceId },
					removedAt: null,
				},
				...(policyIds.length > 0
					? {
							policy: { id: { notIn: policyIds }, space: { id: spaceId } },
						}
					: {}),
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
			role: true,
			policy: {
				include: {
					space: true,
					createdBy: true,
					entries: {
						where: {
							removedAt: null,
							ability: { removedAt: null },
						},
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
				},
			},
		} satisfies Prisma.RoleAssignmentInclude;
	}
}
