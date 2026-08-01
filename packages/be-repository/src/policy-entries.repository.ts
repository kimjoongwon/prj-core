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

	async findActiveByPolicyId(policyId: string): Promise<PolicyEntry[]> {
		const results = await this.txHost.tx.policyEntry.findMany({
			where: {
				policy: { id: policyId },
				removedAt: null,
				ability: { removedAt: null },
			},
			include: this.includeAbility(),
			orderBy: { createdAt: "asc" },
		});

		return results.map((result) => toDomainEntity(PolicyEntry, result));
	}

	async syncByPolicyId(
		policyId: string,
		abilityIds: string[],
	): Promise<PolicyEntry[]> {
		this.logger.debug(
			`PolicyEntry 동기화: policyId=${policyId.slice(-8)}, count=${abilityIds.length}`,
		);

		const uniqueAbilityIds = Array.from(new Set(abilityIds));

		await this.softRemoveMissing(policyId, uniqueAbilityIds);

		await Promise.all(
			uniqueAbilityIds.map(async (abilityId) => {
				const existing = await this.txHost.tx.policyEntry.findFirst({
					where: {
						policy: { id: policyId },
						ability: { id: abilityId },
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
						policy: { connect: { id: policyId } },
						ability: { connect: { id: abilityId } },
					},
				});
			}),
		);

		return this.findActiveByPolicyId(policyId);
	}

	async removeByAbilityId(abilityId: string): Promise<number> {
		this.logger.debug(
			`Ability ID로 PolicyEntry 소프트 삭제: abilityId=${abilityId.slice(-8)}`,
		);

		const result = await this.txHost.tx.policyEntry.updateMany({
			where: {
				ability: { id: abilityId },
				removedAt: null,
			},
			data: {
				removedAt: new Date(),
			},
		});

		return result.count;
	}

	private async softRemoveMissing(
		policyId: string,
		abilityIds: string[],
	): Promise<void> {
		await this.txHost.tx.policyEntry.updateMany({
			where: {
				policy: { id: policyId },
				removedAt: null,
				...(abilityIds.length > 0
					? { ability: { id: { notIn: abilityIds } } }
					: {}),
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
