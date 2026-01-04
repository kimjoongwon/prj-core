import { Ability } from "@cocrepo/entity";
import {
	AbilitiesRepository,
	CreateAbilityDto,
	UsersRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

/**
 * Ability 서비스 에러 메시지
 */
const AbilityServiceErrorMessages = {
	USER_NOT_FOUND: "사용자를 찾을 수 없습니다",
	ROLE_NOT_FOUND: "역할(Role)을 찾을 수 없습니다",
	NO_ABILITIES_FOUND: "권한 정보를 찾을 수 없습니다",
	INVALID_ABILITY_DATA: "유효하지 않은 권한 데이터입니다",
} as const;

@Injectable()
export class AbilitiesService {
	private readonly logger = new Logger(AbilitiesService.name);

	constructor(
		private readonly repository: AbilitiesRepository,
		private readonly usersRepository: UsersRepository,
	) {}

	/**
	 * 내 권한 목록 조회
	 * 사용자의 Role을 조회한 후, 해당 Role의 Ability 목록을 반환합니다.
	 *
	 * @param userId - 사용자 ID
	 * @returns Subject 관계를 포함한 Ability 배열
	 * @throws NotFoundException - 사용자를 찾을 수 없는 경우
	 * @throws BadRequestException - 사용자에게 Role이 할당되지 않은 경우
	 */
	async getMyAbilities(userId: string): Promise<Ability[]> {
		this.logger.debug(`내 권한 조회: userId=${userId.slice(-8)}`);

		// 1. 사용자 조회 (Tenant 포함)
		const user = await this.usersRepository.findByIdWithRelations(userId);

		if (!user) {
			throw new NotFoundException(AbilityServiceErrorMessages.USER_NOT_FOUND);
		}

		// 2. 사용자의 첫 번째 Tenant에서 Role 추출
		if (!user.tenants || user.tenants.length === 0) {
			this.logger.warn(
				`사용자에게 Tenant가 할당되지 않았습니다: userId=${userId.slice(-8)}`,
			);
			throw new BadRequestException(AbilityServiceErrorMessages.ROLE_NOT_FOUND);
		}

		const roleId = user.tenants[0].roleId;

		// 3. Role별 Ability 조회
		const abilities = await this.repository.findByRoleId(roleId);

		return abilities;
	}

	/**
	 * Role별 권한 조회
	 * 특정 Role에 할당된 모든 Ability를 조회합니다.
	 *
	 * @param roleId - Role ID
	 * @returns Subject 관계를 포함한 Ability 배열
	 */
	async getAbilitiesByRoleId(roleId: string): Promise<Ability[]> {
		this.logger.debug(`Role별 권한 조회: roleId=${roleId.slice(-8)}`);

		// Role별 Ability 조회
		const abilities = await this.repository.findByRoleId(roleId);

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
		abilities: CreateAbilityDto[],
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

		// 2. Repository의 upsertMany를 통한 트랜잭션 일괄 업데이트
		// (기존 Ability 소프트 삭제 + 새 Ability 생성)
		const updatedAbilities = await this.repository.upsertMany(
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
