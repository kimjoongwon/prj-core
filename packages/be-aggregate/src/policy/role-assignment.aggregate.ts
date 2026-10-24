import { USER_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { RoleAssignment } from "@cocrepo/entity";
import type { SyncRoleAssignmentInputItem } from "@cocrepo/input";
import {
	PoliciesRepository,
	RoleAssignmentsRepository,
	RolesRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class RoleAssignmentAggregate {
	private readonly logger = new Logger(RoleAssignmentAggregate.name);

	constructor(
		private readonly policiesRepository: PoliciesRepository,
		private readonly roleAssignmentsRepository: RoleAssignmentsRepository,
		private readonly rolesRepository: RolesRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	async getRoleAssignments(roleId: bigint): Promise<RoleAssignment[]> {
		const spaceId = this.requireSpaceId();
		await this.assertRoleExists(roleId);
		return this.roleAssignmentsRepository.findByRoleIdInSpace(roleId, spaceId);
	}

	@Transactional()
	async syncRoleAssignments(
		roleId: bigint,
		roleAssignments: SyncRoleAssignmentInputItem[],
	): Promise<RoleAssignment[]> {
		const spaceId = this.requireSpaceId();
		await this.assertRoleExists(roleId);
		await this.assertPoliciesBelongToSpace(
			roleAssignments.map((policy) => policy.policyId),
			spaceId,
		);

		this.logger.debug(
			`RoleAssignment 동기화: roleId=${roleId}, spaceId=${spaceId}`,
		);

		return this.roleAssignmentsRepository.syncByRoleId(
			roleId,
			roleAssignments,
			spaceId,
		);
	}

	private async assertRoleExists(roleId: bigint): Promise<void> {
		const role = await this.rolesRepository.findById(roleId);
		if (!role) {
			throw new NotFoundException("역할을 찾을 수 없습니다");
		}
	}

	private async assertPoliciesBelongToSpace(
		policyIds: bigint[],
		spaceId: bigint,
	): Promise<void> {
		const uniquePolicyIds = Array.from(new Set(policyIds));
		if (uniquePolicyIds.length === 0) return;

		const scopedPolicyIds =
			await this.policiesRepository.findActivePolicyIdsInSpace(
				uniquePolicyIds,
				spaceId,
			);
		const scopedSet = new Set(scopedPolicyIds);
		const invalidIds = uniquePolicyIds.filter((id) => !scopedSet.has(id));

		if (invalidIds.length > 0) {
			throw new BadRequestException(
				`현재 Tenant의 정책만 할당할 수 있습니다: ${invalidIds.join(", ")}`,
			);
		}
	}

	private requireSpaceId(): bigint {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}
		return spaceId;
	}
}
