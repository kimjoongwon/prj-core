import { Ability } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { AbilitiesService, UsersService } from "@cocrepo/service";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

/**
 * Abilities Facade 에러 메시지
 */
const AbilitiesFacadeErrorMessages = {
	USER_NOT_FOUND: "사용자를 찾을 수 없습니다",
	ROLE_NOT_FOUND: "역할(Role)을 찾을 수 없습니다",
} as const;

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
			throw new NotFoundException(AbilitiesFacadeErrorMessages.USER_NOT_FOUND);
		}

		// 2. 사용자의 모든 Tenant에서 Role ID 추출
		if (!user.tenants || user.tenants.length === 0) {
			this.logger.warn(
				`사용자에게 Tenant가 할당되지 않았습니다: userId=${userId.slice(-8)}`,
			);
			throw new BadRequestException(
				AbilitiesFacadeErrorMessages.ROLE_NOT_FOUND,
			);
		}

		const roleIds = user.tenants.map((tenant) => tenant.roleId);

		// 3. Role + User 권한 병합 조회 (AbilitiesService 통해)
		return this.abilitiesService.getMergedAbilities(roleIds, userId);
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
	 * Role 권한 일괄 설정
	 * 기존 Ability를 소프트 삭제하고 새로운 Ability를 생성합니다.
	 *
	 * @param roleId - Role ID
	 * @param abilities - 설정할 권한 배열
	 * @returns 생성된 Ability 배열
	 */
	async batchSetRoleAbilities(
		roleId: string,
		abilities: Prisma.AbilityCreateManyInput[],
	): Promise<Ability[]> {
		this.logger.debug(
			`Role 권한 일괄 설정: roleId=${roleId.slice(-8)}, count=${abilities.length}`,
		);

		return this.abilitiesService.batchSetRoleAbilities(roleId, abilities);
	}

	/**
	 * User 예외 권한 일괄 설정
	 * 기존 예외 Ability를 소프트 삭제하고 새로운 Ability를 생성합니다.
	 *
	 * @param userId - User ID
	 * @param abilities - 설정할 권한 배열
	 * @returns 생성된 Ability 배열
	 */
	async batchSetUserAbilities(
		userId: string,
		abilities: Prisma.AbilityCreateManyInput[],
	): Promise<Ability[]> {
		this.logger.debug(
			`User 예외 권한 일괄 설정: userId=${userId.slice(-8)}, count=${abilities.length}`,
		);

		return this.abilitiesService.batchSetUserAbilities(userId, abilities);
	}
}
