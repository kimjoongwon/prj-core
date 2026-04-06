import { GRANT_ERRORS } from "@cocrepo/constant";
import { RoleGrant } from "@cocrepo/entity";
import {
	AbilitiesRepository,
	RoleGrantsRepository,
	RolesRepository,
} from "@cocrepo/repository";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

export interface RoleGrantAssignmentInput {
	abilityId: string;
	isActive?: boolean;
	priority?: number;
}

/**
 * RoleGrant 서비스
 *
 * Role의 기본 권한 묶음을 전체 동기화 방식으로 관리합니다.
 */
@Injectable()
export class RoleGrantService {
	private readonly logger = new Logger(RoleGrantService.name);

	constructor(
		private readonly roleGrantsRepository: RoleGrantsRepository,
		private readonly rolesRepository: RolesRepository,
		private readonly abilitiesRepository: AbilitiesRepository,
	) {}

	@Transactional()
	async batchAssignToRole(
		roleId: string,
		items: RoleGrantAssignmentInput[],
	): Promise<RoleGrant[]> {
		const role = await this.rolesRepository.findById(roleId);
		if (!role) {
			throw new NotFoundException(GRANT_ERRORS.ROLE_NOT_FOUND);
		}

		const uniqueAbilityIds = [...new Set(items.map((item) => item.abilityId))];
		const abilities =
			uniqueAbilityIds.length > 0
				? await this.abilitiesRepository.findByIds(uniqueAbilityIds)
				: [];

		if (abilities.length !== uniqueAbilityIds.length) {
			throw new NotFoundException(GRANT_ERRORS.ABILITY_NOT_FOUND);
		}

		const existingRoleGrants =
			await this.roleGrantsRepository.findActiveByRoleIds([roleId]);
		const nextByAbilityId = new Map(
			items.map((item) => [item.abilityId, item] as const),
		);

		const grantsToRemove = existingRoleGrants.filter(
			(grant) => !nextByAbilityId.has(grant.abilityId),
		);

		if (grantsToRemove.length > 0) {
			await Promise.all(
				grantsToRemove.map((grant) =>
					this.roleGrantsRepository.removeById(grant.id),
				),
			);
		}

		if (items.length > 0) {
			await Promise.all(
				items.map((item) =>
					this.roleGrantsRepository.upsertByRoleIdAndAbilityId(
						roleId,
						item.abilityId,
						{
							isActive: item.isActive ?? true,
							priority: item.priority ?? 0,
						},
					),
				),
			);
		}

		this.logger.debug(
			`RoleGrant 배치 동기화 완료: roleId=${roleId.slice(-8)}, count=${items.length}`,
		);

		return this.roleGrantsRepository.findActiveByRoleIds([roleId]);
	}
}
