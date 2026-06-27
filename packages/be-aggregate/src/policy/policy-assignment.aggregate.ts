import { USER_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { RolePolicy } from "@cocrepo/entity";
import type { SyncRolePolicyInputItem } from "@cocrepo/input";
import {
	PoliciesRepository,
	RolePoliciesRepository,
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
export class PolicyAssignmentAggregate {
	private readonly logger = new Logger(PolicyAssignmentAggregate.name);

	constructor(
		private readonly policiesRepository: PoliciesRepository,
		private readonly rolePoliciesRepository: RolePoliciesRepository,
		private readonly rolesRepository: RolesRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	async getRolePolicies(roleId: string): Promise<RolePolicy[]> {
		const tenantId = this.requireTenantId();
		await this.assertRoleExists(roleId);
		return this.rolePoliciesRepository.findByRoleIdInTenant(roleId, tenantId);
	}

	@Transactional()
	async syncRolePolicies(
		roleId: string,
		rolePolicies: SyncRolePolicyInputItem[],
	): Promise<RolePolicy[]> {
		const tenantId = this.requireTenantId();
		await this.assertRoleExists(roleId);
		await this.assertPoliciesBelongToTenant(
			rolePolicies.map((policy) => policy.policyId),
			tenantId,
		);

		this.logger.debug(
			`RolePolicy 동기화: roleId=${roleId.slice(-8)}, tenantId=${tenantId.slice(-8)}`,
		);

		return this.rolePoliciesRepository.syncByRoleId(
			roleId,
			rolePolicies,
			tenantId,
		);
	}

	private async assertRoleExists(roleId: string): Promise<void> {
		const role = await this.rolesRepository.findById(roleId);
		if (!role) {
			throw new NotFoundException("역할을 찾을 수 없습니다");
		}
	}

	private async assertPoliciesBelongToTenant(
		policyIds: string[],
		tenantId: string,
	): Promise<void> {
		const uniquePolicyIds = Array.from(new Set(policyIds));
		if (uniquePolicyIds.length === 0) return;

		const scopedPolicyIds =
			await this.policiesRepository.findActivePolicyIdsInTenant(
				uniquePolicyIds,
				tenantId,
			);
		const scopedSet = new Set(scopedPolicyIds);
		const invalidIds = uniquePolicyIds.filter((id) => !scopedSet.has(id));

		if (invalidIds.length > 0) {
			throw new BadRequestException(
				`현재 Tenant의 정책만 할당할 수 있습니다: ${invalidIds.join(", ")}`,
			);
		}
	}

	private requireTenantId(): string {
		const tenantId = this.spaceContext.tenantId;
		if (!tenantId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}
		return tenantId;
	}
}
