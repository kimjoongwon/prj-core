import { GRANT_ERRORS } from "@cocrepo/constant";
import { CreateGrantDto, GranteeTypeEnum, UpdateGrantDto } from "@cocrepo/dto";
import { Grant } from "@cocrepo/entity";
import { GranteeType } from "@cocrepo/enum";
import type { Prisma } from "@cocrepo/prisma";
import {
	AbilitiesRepository,
	GrantsRepository,
	RolesRepository,
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
 * Grants 서비스
 *
 * @description
 * Role 또는 User에게 Ability를 부여하는 비즈니스 로직을 담당합니다.
 *
 * - granteeType 검증 (Role/User 존재 확인)
 * - abilityId 검증
 * - 기본 우선순위 설정 (Role: 0, User: 10)
 *
 * ✅ Service 레이어: 비즈니스 로직만 담당
 * ❌ Repository 직접 호출만 허용 (Prisma 쿼리 금지)
 */
@Injectable()
export class GrantsService {
	private readonly logger = new Logger(GrantsService.name);

	constructor(
		private readonly grantsRepository: GrantsRepository,
		private readonly rolesRepository: RolesRepository,
		private readonly usersRepository: UsersRepository,
		private readonly abilitiesRepository: AbilitiesRepository,
	) {}

	/**
	 * Grant 생성
	 *
	 * @param dto - Grant 생성 DTO
	 * @returns 생성된 Grant
	 * @throws NotFoundException - Grantee 또는 Ability가 존재하지 않는 경우
	 * @throws BadRequestException - 중복 Grant 생성 시도 시
	 */
	@Transactional()
	async create(dto: CreateGrantDto): Promise<Grant> {
		this.logger.debug(
			`Grant 생성: granteeType=${dto.granteeType}, granteeId=${dto.granteeId.slice(-8)}, abilityId=${dto.abilityId.slice(-8)}`,
		);

		// 1. Grantee 검증 (Role 또는 User 존재 확인)
		await this.validateGrantee(dto.granteeType, dto.granteeId);

		// 2. Ability 검증
		await this.validateAbility(dto.abilityId);

		// 3. 기본 우선순위 설정
		const priority = dto.priority ?? this.getDefaultPriority(dto.granteeType);

		// 4. Grant 생성 (Repository 호출)
		try {
			return await this.grantsRepository.create({
				granteeType: dto.granteeType,
				granteeId: dto.granteeId,
				abilityId: dto.abilityId,
				isActive: dto.isActive ?? true,
				priority,
			});
		} catch (error) {
			// Unique constraint 위반 시
			if (
				error instanceof Error &&
				error.message.includes("Unique constraint")
			) {
				throw new BadRequestException(
					GRANT_ERRORS.DUPLICATE_GRANT,
				);
			}
			throw error;
		}
	}

	/**
	 * Grant 다중 생성
	 *
	 * @param dtos - Grant 생성 DTO 배열
	 * @returns 생성된 Grant 배열
	 * @throws NotFoundException - Grantee 또는 Ability가 존재하지 않는 경우
	 */
	@Transactional()
	async createMany(dtos: CreateGrantDto[]): Promise<Grant[]> {
		this.logger.debug(`Grant 다중 생성: count=${dtos.length}`);

		// 1. 모든 DTO 검증
		for (const dto of dtos) {
			await this.validateGrantee(dto.granteeType, dto.granteeId);
			await this.validateAbility(dto.abilityId);
		}

		// 2. Prisma 타입으로 변환
		const createInputs: Prisma.GrantCreateManyInput[] = dtos.map((dto) => ({
			granteeType: dto.granteeType,
			granteeId: dto.granteeId,
			abilityId: dto.abilityId,
			isActive: dto.isActive ?? true,
			priority: dto.priority ?? this.getDefaultPriority(dto.granteeType),
		}));

		// 3. 다중 생성 (Repository 호출)
		await this.grantsRepository.createMany(createInputs);

		// 4. 생성된 Grant 조회 (각 DTO의 조합으로 조회)
		// Note: createMany는 생성된 객체를 반환하지 않으므로, 별도 조회 필요
		const grants: Grant[] = [];
		for (const dto of dtos) {
			const granteeType = this.toRepositoryGranteeType(dto.granteeType);
			const grant = await this.grantsRepository.findByGranteeTypeAndIds(
				granteeType,
				[dto.granteeId],
				{ includeAbility: true },
			);
			grants.push(...grant);
		}

		return grants;
	}

	/**
	 * Grant 수정
	 *
	 * @param id - Grant ID
	 * @param dto - 수정 DTO
	 * @returns 수정된 Grant
	 * @throws NotFoundException - Grant가 존재하지 않는 경우
	 */
	async update(id: string, dto: UpdateGrantDto): Promise<Grant> {
		this.logger.debug(`Grant 수정: id=${id.slice(-8)}`);

		// Grant 존재 여부 확인 (findById가 없으므로 update 시 에러로 처리)
		// Repository에 findById가 없는 경우, update 실패 시 NotFoundException 발생
		try {
			return await this.grantsRepository.updateById(id, {
				isActive: dto.isActive,
				priority: dto.priority,
			});
		} catch (error) {
			if (
				error instanceof Error &&
				error.message.includes("Record to update not found")
			) {
				throw new NotFoundException(GRANT_ERRORS.NOT_FOUND);
			}
			throw error;
		}
	}

	/**
	 * Grant 삭제 (소프트 삭제)
	 *
	 * @param id - Grant ID
	 * @throws NotFoundException - Grant가 존재하지 않는 경우
	 */
	async delete(id: string): Promise<void> {
		this.logger.debug(`Grant 삭제: id=${id.slice(-8)}`);

		try {
			await this.grantsRepository.removeById(id);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message.includes("Record to update not found")
			) {
				throw new NotFoundException(GRANT_ERRORS.NOT_FOUND);
			}
			throw error;
		}
	}

	/**
	 * Role ID 목록으로 Grant 조회
	 *
	 * @param roleIds - Role ID 배열
	 * @returns Grant 배열 (Ability 포함)
	 */
	async findByRoleIds(roleIds: string[]): Promise<Grant[]> {
		this.logger.debug(`Role ID로 Grant 조회: roleIds.length=${roleIds.length}`);

		return this.grantsRepository.findActiveByRoleIds(roleIds);
	}

	/**
	 * User ID로 Grant 조회
	 *
	 * @param userId - User ID
	 * @returns Grant 배열 (Ability 포함)
	 */
	async findByUserId(userId: string): Promise<Grant[]> {
		this.logger.debug(`User ID로 Grant 조회: userId=${userId.slice(-8)}`);

		return this.grantsRepository.findActiveByUserId(userId);
	}

	/**
	 * Ability ID로 Grant 조회
	 *
	 * @param abilityId - Ability ID
	 * @returns Grant 배열
	 */
	async findByAbilityId(abilityId: string): Promise<Grant[]> {
		this.logger.debug(
			`Ability ID로 Grant 조회: abilityId=${abilityId.slice(-8)}`,
		);

		return this.grantsRepository.findByAbilityId(abilityId);
	}

	/**
	 * Role에 Ability 배치 할당 (전체 동기화)
	 *
	 * 기존 Grant 목록과 새 목록을 비교하여:
	 * - 새로 추가된 Ability는 Grant 생성
	 * - 제거된 Ability는 Grant 소프트 삭제
	 * - 변경된 메타데이터(isActive, priority)는 업데이트
	 *
	 * @param roleId - Role ID
	 * @param items - 배치 할당 항목 배열
	 * @returns 최종 Grant 목록
	 */
	@Transactional()
	async batchAssignToRole(roleId: string, items: { abilityId: string; isActive?: boolean; priority?: number }[]): Promise<Grant[]> {
		// 1. Role 존재 확인
		const role = await this.rolesRepository.findById(roleId);
		if (!role) {
			throw new NotFoundException(GRANT_ERRORS.ROLE_NOT_FOUND);
		}

		// 2. 현재 Role의 Grant 목록 조회
		const existingGrants = await this.grantsRepository.findByGranteeTypeAndIds(
			GranteeType.Role,
			[roleId],
			{ includeAbility: true },
		);

		// 3. 동기화 계산
		const existingMap = new Map(existingGrants.map(g => [g.abilityId, g]));
		const newMap = new Map(items.map(item => [item.abilityId, item]));

		// 3a. 추가할 Grant (새 목록에만 있는 것)
		const toCreate = items.filter(item => !existingMap.has(item.abilityId));

		// 3b. 삭제할 Grant (기존에만 있는 것)
		const toRemove = existingGrants.filter(g => !newMap.has(g.abilityId));

		// 3c. 업데이트할 Grant (양쪽에 있지만 값이 다른 것)
		const toUpdate = items.filter(item => {
			const existing = existingMap.get(item.abilityId);
			if (!existing) return false;
			return existing.isActive !== (item.isActive ?? true) ||
			       existing.priority !== (item.priority ?? 0);
		});

		// 4. Ability 존재 확인 (추가할 것들만)
		for (const item of toCreate) {
			await this.validateAbility(item.abilityId);
		}

		// 5. 실행
		// 5a. 삭제
		for (const grant of toRemove) {
			await this.grantsRepository.removeById(grant.id);
		}

		// 5b. 추가
		if (toCreate.length > 0) {
			const createInputs = toCreate.map(item => ({
				granteeType: GranteeTypeEnum.Role as string,
				granteeId: roleId,
				abilityId: item.abilityId,
				isActive: item.isActive ?? true,
				priority: item.priority ?? 0,
			}));
			await this.grantsRepository.createMany(createInputs);
		}

		// 5c. 업데이트
		for (const item of toUpdate) {
			const existing = existingMap.get(item.abilityId)!;
			await this.grantsRepository.updateById(existing.id, {
				isActive: item.isActive ?? true,
				priority: item.priority ?? 0,
			});
		}

		// 6. 최종 결과 조회
		return this.grantsRepository.findByGranteeTypeAndIds(
			GranteeType.Role,
			[roleId],
			{ includeAbility: true },
		);
	}

	// ============================================================================
	// Private 검증 메서드
	// ============================================================================

	/**
	 * Grantee (Role 또는 User) 존재 여부 검증
	 *
	 * @param granteeType - Grantee 유형
	 * @param granteeId - Grantee ID
	 * @throws NotFoundException - Grantee가 존재하지 않는 경우
	 */
	private async validateGrantee(
		granteeType: GranteeTypeEnum,
		granteeId: string,
	): Promise<void> {
		if (granteeType === GranteeTypeEnum.Role) {
			const role = await this.rolesRepository.findById(granteeId);
			if (!role) {
				throw new NotFoundException(GRANT_ERRORS.ROLE_NOT_FOUND);
			}
		} else if (granteeType === GranteeTypeEnum.User) {
			const user = await this.usersRepository.findById(granteeId);
			if (!user) {
				throw new NotFoundException(GRANT_ERRORS.USER_NOT_FOUND);
			}
		}
	}

	/**
	 * Ability 존재 여부 검증
	 *
	 * @param abilityId - Ability ID
	 * @throws NotFoundException - Ability가 존재하지 않는 경우
	 */
	private async validateAbility(abilityId: string): Promise<void> {
		const ability = await this.abilitiesRepository.findById(abilityId);
		if (!ability) {
			throw new NotFoundException(
				GRANT_ERRORS.ABILITY_NOT_FOUND,
			);
		}
	}

	/**
	 * Grantee 유형별 기본 우선순위 반환
	 *
	 * @param granteeType - Grantee 유형
	 * @returns 기본 우선순위
	 */
	private getDefaultPriority(granteeType: GranteeTypeEnum): number {
		return granteeType === GranteeTypeEnum.Role ? 0 : 10;
	}

	/**
	 * DTO GranteeTypeEnum을 Repository GranteeType으로 변환
	 *
	 * @param granteeType - DTO GranteeTypeEnum
	 * @returns Repository GranteeType
	 */
	private toRepositoryGranteeType(
		granteeType: GranteeTypeEnum,
	): GranteeType {
		return granteeType === GranteeTypeEnum.Role
			? GranteeType.Role
			: GranteeType.User;
	}
}
