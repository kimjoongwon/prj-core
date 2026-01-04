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
} as const;

/**
 * Ability 서비스
 * 단일 도메인(Ability) 로직만 담당
 *
 * ✅ 단일 Repository 의존
 * ❌ 다른 도메인 Repository 의존 금지
 */
@Injectable()
export class AbilitiesService {
	private readonly logger = new Logger(AbilitiesService.name);

	constructor(private readonly repository: AbilitiesRepository) {}

	/**
	 * Role별 권한 조회
	 * 특정 Role에 할당된 모든 Ability를 조회합니다.
	 *
	 * @param roleId - Role ID
	 * @returns Subject 관계를 포함한 Ability 배열
	 */
	async getAbilitiesByRoleId(roleId: string): Promise<Ability[]> {
		this.logger.debug(`Role별 권한 조회: roleId=${roleId.slice(-8)}`);

		const abilities =
			await this.repository.findManyByRoleIdWithRoleAndSubject(roleId);

		return abilities;
	}

	/**
	 * Role 권한 일괄 업데이트
	 * 기존 Ability를 소프트 삭제하고 새로운 Ability를 생성합니다.
	 * 트랜잭션으로 원자성을 보장합니다.
	 *
	 * @param roleId - Role ID
	 * @param tenantId - Tenant ID
	 * @param abilities - 생성할 Ability 배열
	 * @returns 생성된 Ability 배열
	 * @throws BadRequestException - 유효하지 않은 데이터인 경우
	 */
	@Transactional()
	async updateRoleAbilities(
		roleId: string,
		tenantId: string,
		abilities: Prisma.AbilityCreateManyInput[],
	): Promise<Ability[]> {
		this.logger.debug(
			`Role 권한 일괄 업데이트: roleId=${roleId.slice(-8)}, count=${abilities.length}`,
		);

		// 1. 유효성 검증
		if (!roleId || !tenantId) {
			throw new BadRequestException(
				AbilityServiceErrorMessages.INVALID_ABILITY_DATA,
			);
		}

		if (!abilities || abilities.length === 0) {
			this.logger.warn(
				`빈 Ability 배열이 전달되었습니다: roleId=${roleId.slice(-8)}`,
			);
		}

		// 2. Repository의 replaceByRoleId를 통한 트랜잭션 일괄 업데이트
		// (기존 Ability 소프트 삭제 + 새 Ability 생성)
		const updatedAbilities = await this.repository.replaceByRoleId(
			roleId,
			tenantId,
			abilities,
		);

		this.logger.log(
			`Role 권한 업데이트 완료: roleId=${roleId.slice(-8)}, count=${updatedAbilities.length}`,
		);

		return updatedAbilities;
	}
}
