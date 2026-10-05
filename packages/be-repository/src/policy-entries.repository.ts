import { PolicyEntry } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class PolicyEntriesRepository {
	private readonly logger = new Logger(PolicyEntriesRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findActiveByPolicyId(policyId: bigint): Promise<PolicyEntry[]> {
		const results = await this.txHost.tx.policyEntry.findMany({
			where: {
				policyId,
				removedAt: null,
				ability: { removedAt: null },
			},
			include: this.includeAbility(),
			orderBy: { createdAt: "asc" },
		});

		return results.map((result) => toDomainEntity(PolicyEntry, result));
	}

	async syncByPolicyId(
		policyId: bigint,
		abilityIds: bigint[],
	): Promise<PolicyEntry[]> {
		this.logger.debug(
			`PolicyEntry 동기화: policyId=${policyId.toString()}, count=${abilityIds.length}`,
		);

		const uniqueAbilityIds = Array.from(new Set(abilityIds));

		await this.softRemoveMissing(policyId, uniqueAbilityIds);

		await Promise.all(
			uniqueAbilityIds.map(async (abilityId) => {
				const existing = await this.txHost.tx.policyEntry.findFirst({
					where: {
						policyId,
						abilityId,
					},
					select: { id: true },
				});

				if (existing) {
					await this.txHost.tx.policyEntry.update({
						where: { id: existing.id },
						data: { removedAt: null },
					});
					return;
				}

				await this.txHost.tx.policyEntry.create({
					data: {
						policyId,
						abilityId,
					},
				});
			}),
		);

		return this.findActiveByPolicyId(policyId);
	}

	async removeByAbilityId(abilityId: bigint): Promise<number> {
		this.logger.debug(
			`Ability ID로 PolicyEntry 소프트 삭제: abilityId=${abilityId.toString()}`,
		);

		const result = await this.txHost.tx.policyEntry.updateMany({
			where: {
				abilityId,
				removedAt: null,
			},
			data: {
				removedAt: new Date(),
			},
		});

		return result.count;
	}

	private async softRemoveMissing(
		policyId: bigint,
		abilityIds: bigint[],
	): Promise<void> {
		await this.txHost.tx.policyEntry.updateMany({
			where: {
				policyId,
				removedAt: null,
				...(abilityIds.length > 0 ? { abilityId: { notIn: abilityIds } } : {}),
			},
			data: {
				removedAt: new Date(),
			},
		});
	}

	private includeAbility() {
		return {
			policy: { select: { id: true } },
			ability: {
				include: {
					subject: true,
					action: true,
				},
			},
		} satisfies Prisma.PolicyEntryInclude;
	}
}
