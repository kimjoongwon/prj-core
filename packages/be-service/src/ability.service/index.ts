import { ABILITY_ERRORS } from "@cocrepo/constant";
import { CreateAbilityInput } from "@cocrepo/dto";
import { Ability } from "@cocrepo/entity";
import type { Prisma } from "@cocrepo/prisma";
import {
	AbilitiesRepository,
	GrantsRepository,
} from "@cocrepo/repository";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";


/**
 * Ability 서비스 (CASL ABAC 기반)
 *
 * 재사용 가능한 권한 정의(Ability)와 할당(Grant)을 관리합니다.
 *
 * ✅ AbilitiesRepository + GrantsRepository 의존
 * ✅ Ability: 권한 정의만 관리 (subject + action + fields + conditions)
 * ✅ Grant: Role/User에 대한 권한 할당 관리 (polymorphic)
 */
@Injectable()
export class AbilityService {
	private readonly logger = new Logger(AbilityService.name);

	constructor(
		private readonly abilitiesRepository: AbilitiesRepository,
		private readonly grantsRepository: GrantsRepository,
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
		this.logger.debug('전체 Ability 목록 조회');
		return this.abilitiesRepository.findAll();
	}

	/**
	 * Role별 기본 권한 조회
	 *
	 * @param roleId - Role ID
	 * @returns 활성화된 Ability 배열 (Grant를 통해 조회)
	 */
	async getRoleAbilities(roleId: string): Promise<Ability[]> {
		this.logger.debug(`Role별 권한 조회: roleId=${roleId.slice(-8)}`);

		// Grant를 통해 Role의 Ability 조회
		const grants = await this.grantsRepository.findActiveByRoleIds([roleId]);

		// Grant에서 Ability 추출 (엔티티 메서드 유지)
		return grants
			.filter((grant) => grant.ability)
			.map((grant) => {
				const ability = grant.ability!;
				// priority를 Grant에서 가져와 설정
				ability.priority = grant.priority;
				return ability as Ability;
			});
	}

	/**
	 * User별 예외 권한 조회
	 *
	 * @param userId - User ID
	 * @returns 활성화된 Ability 배열 (Grant를 통해 조회)
	 */
	async getUserAbilities(userId: string): Promise<Ability[]> {
		this.logger.debug(`User별 예외 권한 조회: userId=${userId.slice(-8)}`);

		// Grant를 통해 User의 Ability 조회
		const grants = await this.grantsRepository.findActiveByUserId(userId);

		// Grant에서 Ability 추출 (엔티티 메서드 유지)
		return grants
			.filter((grant) => grant.ability)
			.map((grant) => {
				const ability = grant.ability!;
				ability.priority = grant.priority;
				return ability as Ability;
			});
	}

	/**
	 * Role + User 권한 병합 조회
	 * User 권한이 Role 권한보다 우선순위가 높습니다.
	 *
	 * @param roleIds - Role ID 배열
	 * @param userId - User ID (선택)
	 * @returns 병합된 Ability 배열
	 */
	async getMergedAbilities(
		roleIds: string[],
		userId?: string,
	): Promise<Ability[]> {
		this.logger.debug(
			`권한 병합 조회: roleIds=${roleIds.length}, userId=${userId?.slice(-8) ?? "없음"}`,
		);

		// 1. Role 기반 권한 조회 (Grant → Ability)
		const roleGrants = await this.grantsRepository.findActiveByRoleIds(roleIds);
		const roleAbilities = roleGrants
			.filter((grant) => grant.ability)
			.map((grant) => {
				const ability = grant.ability!;
				ability.priority = grant.priority;
				return ability as Ability;
			});

		// 2. User 예외 권한 조회 (있는 경우)
		const userAbilities = userId
			? await this.grantsRepository.findActiveByUserId(userId).then((grants) =>
					grants
						.filter((grant) => grant.ability)
						.map((grant) => {
							const ability = grant.ability!;
							ability.priority = grant.priority;
							return ability as Ability;
						}),
				)
			: [];

		// 3. 병합 (User 권한이 우선)
		const merged = [...userAbilities, ...roleAbilities];

		// priority와 createdAt 기준으로 정렬
		merged.sort((a, b) => {
			const aPriority = a.priority ?? 0;
			const bPriority = b.priority ?? 0;
			if (bPriority !== aPriority) {
				return bPriority - aPriority;
			}
			return b.createdAt.getTime() - a.createdAt.getTime();
		});

		return merged;
	}

	/**
	 * 권한 정의 생성
	 *
	 * @param data - Ability 생성 데이터 (재사용 가능한 권한 정의)
	 * @returns 생성된 Ability
	 * @description 권한 정의만 생성합니다. Role/User에 할당하려면 Grant를 생성하세요.
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
	 * @description Ability 정의만 수정합니다. Grant 메타데이터(isActive, priority)는 변경되지 않습니다.
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
	 * @description Ability와 연결된 모든 Grant를 소프트 삭제합니다.
	 */
	@Transactional()
	async deleteAbility(id: string): Promise<Ability> {
		this.logger.debug(`권한 삭제: id=${id.slice(-8)}`);

		// 1. Ability 소프트 삭제
		const ability = await this.abilitiesRepository.removeById(id);

		// 2. 연결된 모든 Grant 소프트 삭제
		await this.grantsRepository.removeByAbilityId(id);

		this.logger.debug(`권한 및 연결된 Grant 삭제 완료: id=${id.slice(-8)}`);

		return ability;
	}

	/**
	 * Ability 데이터 유효성 검증
	 */
	private validateAbilityData(data: Prisma.AbilityUncheckedCreateInput): void {
		// actionId, subjectId, name 필수
		if (!data.actionId || !data.subjectId || !data.name) {
			throw new BadRequestException(
				ABILITY_ERRORS.INVALID_DATA,
			);
		}
	}
}
