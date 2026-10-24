import { RoleAssignment } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

export interface RoleAssignmentInput {
	policySeq: bigint;
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
		roleSeq: bigint,
		spaceSeq: bigint,
	): Promise<RoleAssignment[]> {
		const results = await this.txHost.tx.roleAssignment.findMany({
			where: this.buildRoleAssignmentWhere([roleSeq], spaceSeq),
			include: this.includePolicyEntries(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => toDomainEntity(RoleAssignment, result));
	}

	async findActiveByRoleIdsInSpace(
		roleIds: bigint[],
		spaceSeq: bigint,
	): Promise<RoleAssignment[]> {
		if (roleIds.length === 0) return [];

		const results = await this.txHost.tx.roleAssignment.findMany({
			where: {
				...this.buildRoleAssignmentWhere(roleIds, spaceSeq),
				isActive: true,
			},
			include: this.includePolicyEntries(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => toDomainEntity(RoleAssignment, result));
	}

	async syncByRoleId(
		roleSeq: bigint,
		items: RoleAssignmentInput[],
		spaceSeq: bigint,
	): Promise<RoleAssignment[]> {
		this.logger.debug(
			`RoleAssignment 동기화: roleSeq=${roleSeq.toString()}, count=${items.length}`,
		);

		const uniqueItems = this.dedupeByPolicyId(items);
		const policyIds = uniqueItems.map((item) => item.policySeq);

		await this.softRemoveMissing(roleSeq, policyIds, spaceSeq);

		await Promise.all(
			uniqueItems.map(async (item) => {
				const existing = await this.txHost.tx.roleAssignment.findFirst({
					where: {
						roleSeq,
						policySeq: item.policySeq,
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
						roleSeq,
						policySeq: item.policySeq,
					},
				});
			}),
		);

		const synced = await this.txHost.tx.roleAssignment.findMany({
			where: {
				roleSeq,
				policy: {
					seq: { in: policyIds },
					space: { seq: spaceSeq },
					removedAt: null,
				},
				removedAt: null,
			},
			include: this.includePolicyEntries(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return synced.map((result) => toDomainEntity(RoleAssignment, result));
	}

	async removeByPolicyId(policySeq: bigint): Promise<number> {
		const result = await this.txHost.tx.roleAssignment.updateMany({
			where: {
				policySeq,
				removedAt: null,
			},
			data: {
				removedAt: new Date(),
			},
		});

		return result.count;
	}

	private buildRoleAssignmentWhere(roleIds: bigint[], spaceSeq: bigint) {
		return {
			roleSeq: { in: roleIds },
			removedAt: null,
			policy: {
				space: { seq: spaceSeq },
				removedAt: null,
			},
		} satisfies Prisma.RoleAssignmentWhereInput;
	}

	private async softRemoveMissing(
		roleSeq: bigint,
		policyIds: bigint[],
		spaceSeq: bigint,
	): Promise<void> {
		await this.txHost.tx.roleAssignment.updateMany({
			where: {
				roleSeq,
				removedAt: null,
				policy: {
					space: { seq: spaceSeq },
					removedAt: null,
				},
				...(policyIds.length > 0
					? {
							policy: { seq: { notIn: policyIds }, space: { seq: spaceSeq } },
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
			new Map(items.map((item) => [item.policySeq, item])).values(),
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
