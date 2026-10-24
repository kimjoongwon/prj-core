import { USER_ERRORS } from "@cocrepo/constant";
import { AuthContext, SpaceContext } from "@cocrepo/context";
import { Policy, PolicyEntry } from "@cocrepo/entity";
import type {
	CreatePolicyCommandInput,
	UpdatePolicyCommandInput,
} from "@cocrepo/input";
import {
	AbilitiesRepository,
	PoliciesRepository,
	PolicyEntriesRepository,
	RoleAssignmentsRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class PolicyAggregate {
	private readonly logger = new Logger(PolicyAggregate.name);

	constructor(
		private readonly policiesRepository: PoliciesRepository,
		private readonly policyEntriesRepository: PolicyEntriesRepository,
		private readonly abilitiesRepository: AbilitiesRepository,
		private readonly roleAssignmentsRepository: RoleAssignmentsRepository,
		private readonly spaceContext: SpaceContext,
		private readonly authContext: AuthContext,
	) {}

	async listPolicies(): Promise<Policy[]> {
		const spaceSeq = this.requireSpaceId();
		return this.policiesRepository.findManyBySpaceId(spaceSeq);
	}

	async getPolicyById(policySeq: bigint): Promise<Policy> {
		const spaceSeq = this.requireSpaceId();
		const policy = await this.policiesRepository.findByIdInSpace(
			policySeq,
			spaceSeq,
		);

		if (!policy) {
			throw new NotFoundException("정책을 찾을 수 없습니다");
		}

		return policy;
	}

	async createPolicy(dto: CreatePolicyCommandInput): Promise<Policy> {
		const spaceSeq = this.requireSpaceId();
		const createdBySeq = this.requireUserId();
		this.logger.debug(`Policy 생성: name=${dto.name}, spaceSeq=${spaceSeq}`);

		const existing = await this.policiesRepository.findByNameInSpace(
			spaceSeq,
			dto.name,
		);
		if (existing) {
			throw new ConflictException(`이미 존재하는 정책 이름입니다: ${dto.name}`);
		}

		return this.policiesRepository.create({
			spaceSeq,
			createdBySeq,
			name: dto.name,
			displayName: dto.displayName ?? null,
			description: dto.description ?? null,
		});
	}

	async updatePolicy(
		policySeq: bigint,
		dto: UpdatePolicyCommandInput,
	): Promise<Policy> {
		const policy = await this.getPolicyById(policySeq);

		if (dto.name && dto.name !== policy.name) {
			const existing = await this.policiesRepository.findByNameInSpace(
				policy.spaceSeq,
				dto.name,
			);
			if (existing) {
				throw new ConflictException(
					`이미 존재하는 정책 이름입니다: ${dto.name}`,
				);
			}
		}

		return this.policiesRepository.updateById(policySeq, {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.displayName !== undefined && {
				displayName: dto.displayName,
			}),
			...(dto.description !== undefined && {
				description: dto.description,
			}),
		});
	}

	@Transactional()
	async deletePolicy(policySeq: bigint): Promise<Policy> {
		await this.getPolicyById(policySeq);

		await this.roleAssignmentsRepository.removeByPolicyId(policySeq);

		return this.policiesRepository.removeById(policySeq);
	}

	@Transactional()
	async syncPolicyEntries(
		policySeq: bigint,
		abilityIds: bigint[],
	): Promise<PolicyEntry[]> {
		await this.getPolicyById(policySeq);
		await this.assertAbilitiesExist(abilityIds);
		return this.policyEntriesRepository.syncByPolicyId(policySeq, abilityIds);
	}

	private async assertAbilitiesExist(abilityIds: bigint[]): Promise<void> {
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

	private requireSpaceId(): bigint {
		const spaceSeq = this.spaceContext.spaceSeq;
		if (!spaceSeq) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}
		return spaceSeq;
	}

	private requireUserId(): bigint {
		const userSeq = this.authContext.user?.id;
		if (!userSeq) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}
		return userSeq;
	}
}
