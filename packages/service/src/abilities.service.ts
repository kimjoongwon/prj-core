import { CreateAbilityInput } from "@cocrepo/dto";
import { Ability } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { AbilitiesRepository } from "@cocrepo/repository";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

/**
 * Ability 서비스 에러 메시지
 */
const AbilityServiceErrorMessages = {
	INVALID_ABILITY_DATA: "유효하지 않은 권한 데이터입니다",
	ROLE_OR_USER_REQUIRED: "roleId 또는 userId 중 하나는 필수입니다",
	BOTH_ROLE_AND_USER:
		"roleId와 userId를 동시에 설정할 수 없습니다. 둘 중 하나만 설정하세요",
} as const;

/**
 * Ability 서비스 (CASL ABAC 기반)
 *
 * Role 기반 기본 권한과 User 기반 예외 권한을 관리합니다.
 *
 * ✅ 단일 Repository 의존
 * ❌ 다른 도메인 Repository 의존 금지
 */
@Injectable()
export class AbilitiesService {
	private readonly logger = new Logger(AbilitiesService.name);

	constructor(private readonly repository: AbilitiesRepository) {}

	/**
	 * ID로 Ability 조회
	 *
	 * @param id - Ability ID
	 * @returns Ability 또는 null
	 */
	async getAbilityById(id: string): Promise<Ability | null> {
		this.logger.debug(`ID로 Ability 조회: id=${id.slice(-8)}`);

		return this.repository.findByIdWithRole(id);
	}

	/**
	 * Role별 기본 권한 조회
	 *
	 * @param roleId - Role ID
	 * @returns 활성화된 Ability 배열
	 */
	async getRoleAbilities(roleId: string): Promise<Ability[]> {
		this.logger.debug(`Role별 권한 조회: roleId=${roleId.slice(-8)}`);

		return this.repository.findActiveByRoleId(roleId);
	}

	/**
	 * User별 예외 권한 조회
	 *
	 * @param userId - User ID
	 * @returns 활성화된 Ability 배열
	 */
	async getUserAbilities(userId: string): Promise<Ability[]> {
		this.logger.debug(`User별 예외 권한 조회: userId=${userId.slice(-8)}`);

		return this.repository.findActiveByUserId(userId);
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

		// 1. Role 기반 권한 조회
		const roleAbilities = await this.repository.findActiveByRoleIds(roleIds);

		// 2. User 예외 권한 조회 (있는 경우)
		const userAbilities = userId
			? await this.repository.findActiveByUserId(userId)
			: [];

		// 3. 병합 (User 권한이 우선)
		// User 권한의 priority를 높게 설정하여 우선순위 보장
		const merged = [...userAbilities, ...roleAbilities];

		// priority와 createdAt 기준으로 정렬
		merged.sort((a, b) => {
			if (b.priority !== a.priority) {
				return b.priority - a.priority;
			}
			return b.createdAt.getTime() - a.createdAt.getTime();
		});

		return merged;
	}

	/**
	 * 권한 생성
	 *
	 * @param data - Ability 생성 데이터
	 * @returns 생성된 Ability
	 */
	async createAbility(
		data: Prisma.AbilityUncheckedCreateInput,
	): Promise<Ability> {
		this.logger.debug(
			`권한 생성: subjectId=${data.subjectId}, actionId=${data.actionId}`,
		);

		// 유효성 검증
		this.validateAbilityData(data);

		return this.repository.create(data);
	}

	/**
	 * 권한 수정
	 *
	 * @param id - Ability ID
	 * @param data - 수정 데이터
	 * @returns 수정된 Ability
	 */
	async updateAbility(
		id: string,
		data: Prisma.AbilityUncheckedUpdateInput,
	): Promise<Ability> {
		this.logger.debug(`권한 수정: id=${id.slice(-8)}`);

		return this.repository.updateById(id, data);
	}

	/**
	 * 권한 삭제 (소프트 삭제)
	 *
	 * @param id - Ability ID
	 * @returns 삭제된 Ability
	 */
	async deleteAbility(id: string): Promise<Ability> {
		this.logger.debug(`권한 삭제: id=${id.slice(-8)}`);

		return this.repository.removeById(id);
	}

	/**
	 * Role 권한 일괄 설정
	 * 기존 Ability를 소프트 삭제하고 새로운 Ability를 생성합니다.
	 *
	 * @param roleId - Role ID
	 * @param abilities - 설정할 권한 배열
	 * @returns 생성된 Ability 배열
	 */
	@Transactional()
	async batchSetRoleAbilities(
		roleId: string,
		abilities: CreateAbilityInput[],
	): Promise<Ability[]> {
		this.logger.debug(
			`Role 권한 일괄 설정: roleId=${roleId.slice(-8)}, count=${abilities.length}`,
		);

		// 유효성 검증
		if (!roleId) {
			throw new BadRequestException(
				AbilityServiceErrorMessages.INVALID_ABILITY_DATA,
			);
		}

		// DTO를 Prisma 타입으로 변환
		const prismaAbilities = this.toPrismaCreateInput(abilities);

		return this.repository.replaceByRoleId(roleId, prismaAbilities);
	}

	/**
	 * User 예외 권한 일괄 설정
	 * 기존 예외 Ability를 소프트 삭제하고 새로운 Ability를 생성합니다.
	 *
	 * @param userId - User ID
	 * @param abilities - 설정할 권한 배열
	 * @returns 생성된 Ability 배열
	 */
	@Transactional()
	async batchSetUserAbilities(
		userId: string,
		abilities: CreateAbilityInput[],
	): Promise<Ability[]> {
		this.logger.debug(
			`User 예외 권한 일괄 설정: userId=${userId.slice(-8)}, count=${abilities.length}`,
		);

		// 유효성 검증
		if (!userId) {
			throw new BadRequestException(
				AbilityServiceErrorMessages.INVALID_ABILITY_DATA,
			);
		}

		// DTO를 Prisma 타입으로 변환
		const prismaAbilities = this.toPrismaCreateInput(abilities);

		return this.repository.replaceByUserId(userId, prismaAbilities);
	}

	/**
	 * Ability 데이터 유효성 검증
	 */
	private validateAbilityData(data: Prisma.AbilityUncheckedCreateInput): void {
		// roleId와 userId 중 하나는 필수
		if (!data.roleId && !data.userId) {
			throw new BadRequestException(
				AbilityServiceErrorMessages.ROLE_OR_USER_REQUIRED,
			);
		}

		// roleId와 userId 동시 설정 불가
		if (data.roleId && data.userId) {
			throw new BadRequestException(
				AbilityServiceErrorMessages.BOTH_ROLE_AND_USER,
			);
		}

		// actionId, subjectId 필수
		if (!data.actionId || !data.subjectId) {
			throw new BadRequestException(
				AbilityServiceErrorMessages.INVALID_ABILITY_DATA,
			);
		}
	}

	/**
	 * CreateAbilityInput을 Prisma.AbilityCreateManyInput으로 변환
	 *
	 * @param abilities - DTO 배열
	 * @returns Prisma 타입 배열
	 * @throws BadRequestException - subjectId 또는 actionId가 없는 경우
	 */
	private toPrismaCreateInput(
		abilities: CreateAbilityInput[],
	): Prisma.AbilityCreateManyInput[] {
		return abilities.map((ability) => {
			// subjectId와 actionId가 필수 (추후 actionName/subjectName → ID 변환 로직 추가 가능)
			if (!ability.subjectId || !ability.actionId) {
				throw new BadRequestException(
					"subjectId와 actionId는 필수입니다. (actionName/subjectName 지원 예정)",
				);
			}

			return {
				subjectId: ability.subjectId,
				actionId: ability.actionId,
				fields: ability.fields ?? [],
				conditions: ability.conditions,
				inverted: ability.inverted ?? false,
				reason: ability.reason,
				roleId: ability.roleId,
				userId: ability.userId,
				name: ability.name,
				description: ability.description,
				isActive: ability.isActive ?? true,
				priority: ability.priority ?? 0,
			};
		});
	}
}
