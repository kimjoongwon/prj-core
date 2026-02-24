import { ABILITY_ERRORS } from "@cocrepo/constant";
import { Ability } from "@cocrepo/entity";
import {
	AbilitiesService,
	type CreateAbilityInput,
	type UpdateAbilityInput,
	UsersService,
} from "@cocrepo/service";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";


/**
 * Abilities Facade (CASL ABAC 기반)
 * 여러 도메인(User, Ability)을 조합하는 비즈니스 로직 담당
 *
 * ✅ Service Layer를 통해 데이터 접근
 * ❌ Repository/Prisma 직접 호출 금지
 */
@Injectable()
export class AbilitiesFacade {
	private readonly logger = new Logger(AbilitiesFacade.name);

	constructor(
		private readonly usersService: UsersService,
		private readonly abilitiesService: AbilitiesService,
	) {}

	/**
	 * 내 권한 목록 조회 (Role + User 예외 권한 병합)
	 * 사용자의 Role 권한과 예외 권한을 병합하여 반환합니다.
	 *
	 * @param userId - 사용자 ID
	 * @returns 병합된 Ability 배열
	 * @throws NotFoundException - 사용자를 찾을 수 없는 경우
	 * @throws BadRequestException - 사용자에게 Role이 할당되지 않은 경우
	 */
	async getMyAbilities(userId: string): Promise<Ability[]> {
		this.logger.debug(`내 권한 조회: userId=${userId.slice(-8)}`);

		// 1. 사용자 조회 (UsersService 통해)
		const user = await this.usersService.getByIdWithTenants(userId);

		if (!user) {
			throw new NotFoundException(ABILITY_ERRORS.USER_NOT_FOUND);
		}

		// 2. 사용자의 모든 Tenant에서 Role ID 추출
		if (!user.tenants || user.tenants.length === 0) {
			this.logger.warn(
				`사용자에게 Tenant가 할당되지 않았습니다: userId=${userId.slice(-8)}`,
			);
			throw new BadRequestException(
				ABILITY_ERRORS.ROLE_NOT_FOUND,
			);
		}

		const roleIds = user.tenants.map((tenant) => tenant.roleId);

		// 3. Role + User 권한 병합 조회 (AbilitiesService 통해)
		return this.abilitiesService.getMergedAbilities(roleIds, userId);
	}

	/**
	 * ID로 Ability 조회
	 *
	 * @param id - Ability ID
	 * @returns Ability
	 * @throws NotFoundException - 권한을 찾을 수 없는 경우
	 */
	async getAbilityById(id: string): Promise<Ability> {
		this.logger.debug(`권한 조회: id=${id.slice(-8)}`);

		const ability = await this.abilitiesService.getAbilityById(id);

		if (!ability) {
			throw new NotFoundException(
				ABILITY_ERRORS.NOT_FOUND,
			);
		}

		return ability;
	}

	/**
	 * 전체 Ability 목록 조회
	 */
	async getAllAbilities(): Promise<Ability[]> {
		this.logger.debug('전체 Ability 목록 조회');
		return this.abilitiesService.getAllAbilities();
	}

	/**
	 * Role별 기본 권한 조회
	 *
	 * @param roleId - Role ID
	 * @returns 활성화된 Ability 배열
	 */
	async getRoleAbilities(roleId: string): Promise<Ability[]> {
		this.logger.debug(`Role별 권한 조회: roleId=${roleId.slice(-8)}`);

		return this.abilitiesService.getRoleAbilities(roleId);
	}

	/**
	 * User별 예외 권한 조회
	 *
	 * @param userId - User ID
	 * @returns 활성화된 Ability 배열
	 */
	async getUserAbilities(userId: string): Promise<Ability[]> {
		this.logger.debug(`User별 예외 권한 조회: userId=${userId.slice(-8)}`);

		return this.abilitiesService.getUserAbilities(userId);
	}

	/**
	 * 권한 생성
	 *
	 * @param data - Ability 생성 데이터
	 * @returns 생성된 Ability
	 */
	async createAbility(data: CreateAbilityInput): Promise<Ability> {
		this.logger.debug(
			`권한 생성: subjectId=${data.subjectId}, actionId=${data.actionId}`,
		);

		return this.abilitiesService.createAbility(data);
	}

	/**
	 * 권한 수정
	 *
	 * @param id - Ability ID
	 * @param data - 수정 데이터
	 * @returns 수정된 Ability
	 * @throws NotFoundException - 권한을 찾을 수 없는 경우
	 */
	async updateAbility(
		id: string,
		data: UpdateAbilityInput,
	): Promise<Ability> {
		this.logger.debug(`권한 수정: id=${id.slice(-8)}`);

		// 존재 확인
		const existing = await this.abilitiesService.getAbilityById(id);
		if (!existing) {
			throw new NotFoundException(
				ABILITY_ERRORS.NOT_FOUND,
			);
		}

		return this.abilitiesService.updateAbility(id, data);
	}

	/**
	 * 권한 삭제 (소프트 삭제)
	 *
	 * @param id - Ability ID
	 * @returns 삭제된 Ability
	 * @throws NotFoundException - 권한을 찾을 수 없는 경우
	 */
	async deleteAbility(id: string): Promise<Ability> {
		this.logger.debug(`권한 삭제: id=${id.slice(-8)}`);

		// 존재 확인
		const existing = await this.abilitiesService.getAbilityById(id);
		if (!existing) {
			throw new NotFoundException(
				ABILITY_ERRORS.NOT_FOUND,
			);
		}

		return this.abilitiesService.deleteAbility(id);
	}

}
