import { RolePolicy } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

export interface PolicyAssignmentInput {
	policyId: string;
	isActive?: boolean;
	priority?: number;
}

@Injectable()
export class RolePoliciesRepository {
	private readonly logger = new Logger(RolePoliciesRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findByRoleIdInTenant(
		roleId: string,
		tenantId: string,
	): Promise<RolePolicy[]> {
		const results = await this.txHost.tx.rolePolicy.findMany({
			where: this.buildRolePolicyWhere([roleId], tenantId),
			include: this.includePolicyAbilities(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(RolePolicy, result));
	}

	async findActiveByRoleIdsInTenant(
		roleIds: string[],
		tenantId: string,
	): Promise<RolePolicy[]> {
		if (roleIds.length === 0) return [];

		const results = await this.txHost.tx.rolePolicy.findMany({
			where: {
				...this.buildRolePolicyWhere(roleIds, tenantId),
				isActive: true,
			},
			include: this.includePolicyAbilities(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(RolePolicy, result));
	}

	async syncByRoleId(
		roleId: string,
		items: PolicyAssignmentInput[],
		tenantId: string,
	): Promise<RolePolicy[]> {
		this.logger.debug(
			`RolePolicy 동기화: roleId=${roleId.slice(-8)}, count=${items.length}`,
		);

		const uniqueItems = this.dedupeByPolicyId(items);
		const policyIds = uniqueItems.map((item) => item.policyId);

		await this.softRemoveMissing(roleId, policyIds, tenantId);

		await Promise.all(
			uniqueItems.map((item) =>
				this.txHost.tx.rolePolicy.upsert({
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

		const synced = await this.txHost.tx.rolePolicy.findMany({
			where: {
				roleId,
				policyId: { in: policyIds },
				removedAt: null,
				policy: {
					tenantId,
					removedAt: null,
				},
			},
			include: this.includePolicyAbilities(),
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return synced.map((result) => plainToInstance(RolePolicy, result));
	}

	async removeByPolicyId(policyId: string): Promise<number> {
		const result = await this.txHost.tx.rolePolicy.updateMany({
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

	private buildRolePolicyWhere(roleIds: string[], tenantId: string) {
		return {
			roleId: { in: roleIds },
			removedAt: null,
			policy: {
				tenantId,
				removedAt: null,
			},
		} satisfies Prisma.RolePolicyWhereInput;
	}

	private async softRemoveMissing(
		roleId: string,
		policyIds: string[],
		tenantId: string,
	): Promise<void> {
		await this.txHost.tx.rolePolicy.updateMany({
			where: {
				roleId,
				removedAt: null,
				policy: {
					tenantId,
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
		} satisfies Prisma.RolePolicyInclude;
	}
}
