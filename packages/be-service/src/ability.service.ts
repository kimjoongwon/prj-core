import { ABILITY_ERRORS } from "@cocrepo/constant";
import { Ability, RolePolicy, UserPolicy } from "@cocrepo/entity";
import type { Prisma } from "@cocrepo/prisma";
import {
	AbilitiesRepository,
	PolicyAbilitiesRepository,
	RolePoliciesRepository,
	UserPoliciesRepository,
} from "@cocrepo/repository";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

type AbilityWithAssignment = Ability & {
	priority: number;
	sourceRank: number;
	assignmentCreatedAt?: Date;
};

/**
 * Ability 서비스 (CASL ABAC 기반)
 *
 * 재사용 가능한 권한 정의(Ability)와 Policy 기반 할당을 관리합니다.
 *
 * ✅ Ability: 권한 정의만 관리 (subject + action + fields + conditions)
 * ✅ Policy: 여러 Ability를 묶고 RolePolicy/UserPolicy가 우선순위를 관리
 */
@Injectable()
export class AbilityService {
	private readonly logger = new Logger(AbilityService.name);

	constructor(
		private readonly abilitiesRepository: AbilitiesRepository,
		private readonly policyAbilitiesRepository: PolicyAbilitiesRepository,
		private readonly rolePoliciesRepository: RolePoliciesRepository,
		private readonly userPoliciesRepository: UserPoliciesRepository,
	) {}

	/**
	 * ID로 Ability 조회
	 *
	 * @param id - Ability ID
	 * @returns Ability 또는 null
	 */
	async getAbilityById(id: string): Promise<Ability | null> {
		this.logger.debug(`ID로 Ability 조회: id=${id.slice(-8)}`);

		return this.abilitiesRepository.findById(id);
	}

	/**
	 * 전체 Ability 목록 조회
	 * Subject, Action 정보를 포함하여 반환합니다.
	 */
	async getAllAbilities(): Promise<Ability[]> {
		this.logger.debug("전체 Ability 목록 조회");
		return this.abilitiesRepository.findAll();
	}

	/**
	 * Role + User 권한 병합 조회
	 * 현재 Space의 Policy만 펼쳐서 Ability를 계산합니다.
	 *
	 * @param roleIds - Role ID 배열
	 * @param userId - User ID (선택)
	 * @param spaceId - 현재 Space ID
	 * @returns 병합된 Ability 배열
	 */
	async getMergedAbilities(
		roleIds: string[],
		userId: string | undefined,
		spaceId: string,
	): Promise<Ability[]> {
		this.logger.debug(
			`Policy 기반 권한 병합 조회: roleIds=${roleIds.length}, userId=${userId?.slice(-8) ?? "없음"}, spaceId=${spaceId.slice(-8)}`,
		);

		const rolePolicies =
			await this.rolePoliciesRepository.findActiveByRoleIdsInSpace(
				roleIds,
				spaceId,
			);
		const userPolicies = userId
			? await this.userPoliciesRepository.findActiveByUserIdInSpace(
					userId,
					spaceId,
				)
			: [];

		return this.mergeAbilities(
			this.expandRolePolicyAbilities(rolePolicies),
			this.expandUserPolicyAbilities(userPolicies),
		);
	}

	/**
	 * 권한 정의 생성
	 *
	 * @param data - Ability 생성 데이터 (재사용 가능한 권한 정의)
	 * @returns 생성된 Ability
	 * @description 권한 정의만 생성합니다. Role/User에 할당하려면 Policy에 포함한 뒤 Policy를 할당하세요.
	 */
	async createAbility(
		data: Prisma.AbilityUncheckedCreateInput,
	): Promise<Ability> {
		this.logger.debug(
			`권한 정의 생성: name=${data.name}, subjectId=${data.subjectId}, actionId=${data.actionId}`,
		);

		// 유효성 검증
		this.validateAbilityData(data);

		return this.abilitiesRepository.create(data);
	}

	/**
	 * 권한 정의 수정
	 *
	 * @param id - Ability ID
	 * @param data - 수정 데이터
	 * @returns 수정된 Ability
	 * @description Ability 정의만 수정합니다. RolePolicy/UserPolicy 메타데이터(isActive, priority)는 변경되지 않습니다.
	 */
	async updateAbility(
		id: string,
		data: Prisma.AbilityUncheckedUpdateInput,
	): Promise<Ability> {
		this.logger.debug(`권한 정의 수정: id=${id.slice(-8)}`);

		return this.abilitiesRepository.updateById(id, data);
	}

	/**
	 * 권한 삭제 (소프트 삭제)
	 *
	 * @param id - Ability ID
	 * @returns 삭제된 Ability
	 * @description Ability와 연결된 모든 PolicyAbility를 소프트 삭제합니다.
	 */
	@Transactional()
	async deleteAbility(id: string): Promise<Ability> {
		this.logger.debug(`권한 삭제: id=${id.slice(-8)}`);

		// 1. Ability 소프트 삭제
		const ability = await this.abilitiesRepository.removeById(id);

		await this.policyAbilitiesRepository.removeByAbilityId(id);

		this.logger.debug(
			`권한 및 연결된 PolicyAbility 삭제 완료: id=${id.slice(-8)}`,
		);

		return ability;
	}

	/**
	 * Ability 데이터 유효성 검증
	 */
	private validateAbilityData(data: Prisma.AbilityUncheckedCreateInput): void {
		// actionId, subjectId, name 필수
		if (!data.actionId || !data.subjectId || !data.name) {
			throw new BadRequestException(ABILITY_ERRORS.INVALID_DATA);
		}
	}

	private expandRolePolicyAbilities(
		rolePolicies: RolePolicy[],
	): AbilityWithAssignment[] {
		return rolePolicies.flatMap((rolePolicy) =>
			this.expandPolicyAbilities(rolePolicy, 0),
		);
	}

	private expandUserPolicyAbilities(
		userPolicies: UserPolicy[],
	): AbilityWithAssignment[] {
		return userPolicies.flatMap((userPolicy) =>
			this.expandPolicyAbilities(userPolicy, 1),
		);
	}

	private expandPolicyAbilities(
		assignment: RolePolicy | UserPolicy,
		sourceRank: number,
	): AbilityWithAssignment[] {
		const policyAbilities = assignment.policy?.policyAbilities ?? [];

		return policyAbilities
			.filter((policyAbility) => policyAbility.ability)
			.map((policyAbility) => {
				const ability = policyAbility.ability as AbilityWithAssignment;
				ability.priority = assignment.priority;
				ability.sourceRank = sourceRank;
				ability.assignmentCreatedAt = assignment.createdAt;
				return ability;
			});
	}

	private mergeAbilities(
		roleAbilities: AbilityWithAssignment[],
		userAbilities: AbilityWithAssignment[],
	): Ability[] {
		const abilityMap = new Map<string, AbilityWithAssignment>();

		for (const ability of [...roleAbilities, ...userAbilities]) {
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

		if (a.sourceRank !== b.sourceRank) {
			return a.sourceRank - b.sourceRank;
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
