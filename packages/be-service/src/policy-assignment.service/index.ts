import { USER_ERRORS } from "@cocrepo/constant";
import type { SyncRolePoliciesDto, SyncUserPoliciesDto } from "@cocrepo/dto";
import { RolePolicy, UserPolicy } from "@cocrepo/entity";
import {
	PoliciesRepository,
	RolePoliciesRepository,
	RolesRepository,
	UserPoliciesRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { SpaceContext } from "@cocrepo/context";

@Injectable()
export class PolicyAssignmentService {
	private readonly logger = new Logger(PolicyAssignmentService.name);

	constructor(
		private readonly policiesRepository: PoliciesRepository,
		private readonly rolePoliciesRepository: RolePoliciesRepository,
		private readonly userPoliciesRepository: UserPoliciesRepository,
		private readonly rolesRepository: RolesRepository,
		private readonly usersRepository: UsersRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	async getRolePolicies(roleId: string): Promise<RolePolicy[]> {
		const spaceId = this.requireSpaceId();
		await this.assertRoleExists(roleId);
		return this.rolePoliciesRepository.findByRoleIdInSpace(roleId, spaceId);
	}

	@Transactional()
	async syncRolePolicies(
		roleId: string,
		rolePolicies: SyncRolePoliciesDto["rolePolicies"],
	): Promise<RolePolicy[]> {
		const spaceId = this.requireSpaceId();
		await this.assertRoleExists(roleId);
		await this.assertPoliciesBelongToSpace(
			rolePolicies.map((policy) => policy.policyId),
			spaceId,
		);

		this.logger.debug(
			`RolePolicy 동기화: roleId=${roleId.slice(-8)}, spaceId=${spaceId.slice(-8)}`,
		);

		return this.rolePoliciesRepository.syncByRoleId(
			roleId,
			rolePolicies,
			spaceId,
		);
	}

	async getUserPolicies(userId: string): Promise<UserPolicy[]> {
		const spaceId = this.requireSpaceId();
		await this.assertUserExists(userId);
		return this.userPoliciesRepository.findByUserIdInSpace(userId, spaceId);
	}

	@Transactional()
	async syncUserPolicies(
		userId: string,
		userPolicies: SyncUserPoliciesDto["userPolicies"],
	): Promise<UserPolicy[]> {
		const spaceId = this.requireSpaceId();
		await this.assertUserExists(userId);
		await this.assertPoliciesBelongToSpace(
			userPolicies.map((policy) => policy.policyId),
			spaceId,
		);

		this.logger.debug(
			`UserPolicy 동기화: userId=${userId.slice(-8)}, spaceId=${spaceId.slice(-8)}`,
		);

		return this.userPoliciesRepository.syncByUserId(
			userId,
			userPolicies,
			spaceId,
		);
	}

	private async assertRoleExists(roleId: string): Promise<void> {
		const role = await this.rolesRepository.findById(roleId);
		if (!role) {
			throw new NotFoundException("역할을 찾을 수 없습니다");
		}
	}

	private async assertUserExists(userId: string): Promise<void> {
		const user = await this.usersRepository.findById(userId);
		if (!user) {
			throw new NotFoundException("사용자를 찾을 수 없습니다");
		}
	}

	private async assertPoliciesBelongToSpace(
		policyIds: string[],
		spaceId: string,
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
				`현재 Space의 정책만 할당할 수 있습니다: ${invalidIds.join(", ")}`,
			);
		}
	}

	private requireSpaceId(): string {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}
		return spaceId;
	}
}
