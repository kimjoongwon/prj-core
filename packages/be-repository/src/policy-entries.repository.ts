import { PolicyAbility } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class PolicyAbilitiesRepository {
	private readonly logger = new Logger(PolicyAbilitiesRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findActiveByPolicyId(policyId: string): Promise<PolicyAbility[]> {
		const results = await this.txHost.tx.policyAbility.findMany({
			where: {
				policyId,
				removedAt: null,
				ability: { removedAt: null },
			},
			include: this.includeAbility(),
			orderBy: { createdAt: "asc" },
		});

		return results.map((result) => plainToInstance(PolicyAbility, result));
	}

	async syncByPolicyId(
		policyId: string,
		abilityIds: string[],
	): Promise<PolicyAbility[]> {
		this.logger.debug(
			`PolicyAbility 동기화: policyId=${policyId.slice(-8)}, count=${abilityIds.length}`,
		);

		const uniqueAbilityIds = Array.from(new Set(abilityIds));

		await this.softRemoveMissing(policyId, uniqueAbilityIds);

		await Promise.all(
			uniqueAbilityIds.map((abilityId) =>
				this.txHost.tx.policyAbility.upsert({
					where: {
						policyId_abilityId: {
							policyId,
							abilityId,
						},
					},
					create: {
						policyId,
						abilityId,
					},
					update: {
						removedAt: null,
					},
				}),
			),
		);

		return this.findActiveByPolicyId(policyId);
	}

	async removeByAbilityId(abilityId: string): Promise<number> {
		this.logger.debug(
			`Ability ID로 PolicyAbility 소프트 삭제: abilityId=${abilityId.slice(-8)}`,
		);

		const result = await this.txHost.tx.policyAbility.updateMany({
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
		policyId: string,
		abilityIds: string[],
	): Promise<void> {
		await this.txHost.tx.policyAbility.updateMany({
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
			ability: {
				include: {
					subject: true,
					action: true,
				},
			},
		} satisfies Prisma.PolicyAbilityInclude;
	}
}
