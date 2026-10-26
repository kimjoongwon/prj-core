import { Ability, RoleAssignment } from "@cocrepo/entity";
import { RoleAssignmentsRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";
import type { AbilityWithAssignment } from "./ability-with-assignment";

@Injectable()
export class AbilityAggregate {
	private readonly logger = new Logger(AbilityAggregate.name);

	constructor(
		private readonly roleAssignmentsRepository: RoleAssignmentsRepository,
	) {}

	async getMergedAbilities(
		roleIds: bigint[],
		spaceId: bigint,
	): Promise<Ability[]> {
		this.logger.debug(
			`RoleAssignment 기반 권한 병합 조회: roleIds=${roleIds.length}, spaceId=${spaceId}`,
		);

		const roleAssignments =
			await this.roleAssignmentsRepository.findActiveByRoleIdsInSpace(
				roleIds,
				spaceId,
			);

		return this.mergeAbilities(
			this.expandRoleAssignmentAbilities(roleAssignments),
		);
	}

	private expandRoleAssignmentAbilities(
		roleAssignments: RoleAssignment[],
	): AbilityWithAssignment[] {
		return roleAssignments.flatMap((roleAssignment) =>
			this.expandPolicyEntries(roleAssignment),
		);
	}

	private expandPolicyEntries(
		assignment: RoleAssignment,
	): AbilityWithAssignment[] {
		const policyEntries = assignment.policy?.entries ?? [];

		return policyEntries
			.filter((policyEntry) => policyEntry.ability)
			.map((policyEntry) => {
				const ability = policyEntry.ability as AbilityWithAssignment;
				ability.priority = assignment.priority;
				ability.assignmentCreatedAt = assignment.createdAt;
				return ability;
			});
	}

	private mergeAbilities(abilities: AbilityWithAssignment[]): Ability[] {
		const abilityMap = new Map<string, AbilityWithAssignment>();

		for (const ability of abilities) {
			const key = this.getAbilityKey(ability);
			if (!key) continue;

			const existing = abilityMap.get(key);
			if (!existing || this.compareAbilityPriority(ability, existing) > 0) {
				abilityMap.set(key, ability);
			}
		}

		return Array.from(abilityMap.values()).sort((a, b) =>
			this.compareAbilityPriority(b, a),
		);
	}

	private compareAbilityPriority(
		a: AbilityWithAssignment,
		b: AbilityWithAssignment,
	): number {
		if (a.priority !== b.priority) {
			return a.priority - b.priority;
		}

		const aCreatedAt = a.assignmentCreatedAt?.getTime() ?? 0;
		const bCreatedAt = b.assignmentCreatedAt?.getTime() ?? 0;
		return aCreatedAt - bCreatedAt;
	}

	private getAbilityKey(ability: Ability): string | null {
		if (!ability.subject?.name || !ability.action?.name) {
			return null;
		}

		return `${ability.subject.name}:${ability.action.name}`;
	}
}
