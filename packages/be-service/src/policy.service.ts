import { USER_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import type {
	CreatePolicyDto,
	SyncPolicyAbilitiesDto,
	UpdatePolicyDto,
} from "@cocrepo/dto";
import { Policy, PolicyAbility } from "@cocrepo/entity";
import {
	AbilitiesRepository,
	PoliciesRepository,
	PolicyAbilitiesRepository,
	RolePoliciesRepository,
	UserPoliciesRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class PolicyService {
	private readonly logger = new Logger(PolicyService.name);

	constructor(
		private readonly policiesRepository: PoliciesRepository,
		private readonly policyAbilitiesRepository: PolicyAbilitiesRepository,
		private readonly abilitiesRepository: AbilitiesRepository,
		private readonly rolePoliciesRepository: RolePoliciesRepository,
		private readonly userPoliciesRepository: UserPoliciesRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	async listPolicies(): Promise<Policy[]> {
		const spaceId = this.requireSpaceId();
		return this.policiesRepository.findManyBySpaceId(spaceId);
	}

	async getPolicyById(policyId: string): Promise<Policy> {
		const spaceId = this.requireSpaceId();
		const policy = await this.policiesRepository.findByIdInSpace(
			policyId,
			spaceId,
		);

		if (!policy) {
			throw new NotFoundException("정책을 찾을 수 없습니다");
		}

		return policy;
	}

	async createPolicy(dto: CreatePolicyDto): Promise<Policy> {
		const spaceId = this.requireSpaceId();
		this.logger.debug(`Policy 생성: name=${dto.name}, spaceId=${spaceId}`);

		const existing = await this.policiesRepository.findByNameInSpace(
			spaceId,
			dto.name,
		);
		if (existing) {
			throw new ConflictException(`이미 존재하는 정책 이름입니다: ${dto.name}`);
		}

		return this.policiesRepository.create({
			spaceId,
			name: dto.name,
			displayName: dto.displayName ?? null,
			description: dto.description ?? null,
			isSystem: dto.isSystem ?? false,
		});
	}

	async updatePolicy(policyId: string, dto: UpdatePolicyDto): Promise<Policy> {
		const policy = await this.getPolicyById(policyId);

		if (dto.name && dto.name !== policy.name) {
			const existing = await this.policiesRepository.findByNameInSpace(
				policy.spaceId,
				dto.name,
			);
			if (existing) {
				throw new ConflictException(
					`이미 존재하는 정책 이름입니다: ${dto.name}`,
				);
			}
		}

		return this.policiesRepository.updateById(policyId, {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.displayName !== undefined && {
				displayName: dto.displayName,
			}),
			...(dto.description !== undefined && {
				description: dto.description,
			}),
			...(dto.isSystem !== undefined && { isSystem: dto.isSystem }),
		});
	}

	@Transactional()
	async deletePolicy(policyId: string): Promise<Policy> {
		const policy = await this.getPolicyById(policyId);
		if (policy.isSystem) {
			throw new ForbiddenException("시스템 정책은 삭제할 수 없습니다");
		}

		await this.rolePoliciesRepository.removeByPolicyId(policyId);
		await this.userPoliciesRepository.removeByPolicyId(policyId);

		return this.policiesRepository.removeById(policyId);
	}

	@Transactional()
	async syncPolicyAbilities(
		policyId: string,
		abilityIds: SyncPolicyAbilitiesDto["abilityIds"],
	): Promise<PolicyAbility[]> {
		await this.getPolicyById(policyId);
		await this.assertAbilitiesExist(abilityIds);
		return this.policyAbilitiesRepository.syncByPolicyId(policyId, abilityIds);
	}

	private async assertAbilitiesExist(abilityIds: string[]): Promise<void> {
		const uniqueAbilityIds = Array.from(new Set(abilityIds));
		if (uniqueAbilityIds.length === 0) return;

		const abilities =
			await this.abilitiesRepository.findByIds(uniqueAbilityIds);
		const existingIds = new Set(abilities.map((ability) => ability.id));
		const missingIds = uniqueAbilityIds.filter((id) => !existingIds.has(id));

		if (missingIds.length > 0) {
			throw new BadRequestException(
				`존재하지 않는 권한이 포함되어 있습니다: ${missingIds.join(", ")}`,
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
