import { UIConfig } from "@cocrepo/entity";
import { Prisma, UIConfigScope } from "@cocrepo/prisma";
import { FindEffectiveParams, UIConfigRepository } from "@cocrepo/repository";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";

/**
 * UIConfig 서비스 에러 메시지
 */
const UIConfigServiceErrorMessages = {
	CONFIG_NOT_FOUND: "UI 설정을 찾을 수 없습니다",
} as const;

/**
 * UI Config 서비스
 *
 * 하이브리드 UI Config 시스템의 Service 레이어입니다.
 * - 코드 기본값(FieldRegistry)은 프론트엔드에서 관리
 * - DB 오버라이드(UIConfig)만 이 서비스에서 관리
 *
 * 우선순위: USER > ROLE > GLOBAL
 *
 * @see packages/ui/src/registry/field-registry.ts
 */
@Injectable()
export class UIConfigService {
	private readonly logger = new Logger(UIConfigService.name);

	constructor(private readonly repository: UIConfigRepository) {}

	/**
	 * 사용자에게 적용될 설정 조회
	 *
	 * 우선순위(USER > ROLE > GLOBAL)에 따라 가장 구체적인 설정을 반환합니다.
	 * 설정이 없으면 null 반환 (프론트엔드에서 코드 기본값 사용)
	 *
	 * @param params - 조회 파라미터 (spaceId, entity, view, userId?, roleId?)
	 * @returns UI 설정 또는 null
	 */
	getConfig(params: FindEffectiveParams): Promise<UIConfig | null> {
		this.logger.debug(
			`UI 설정 조회: entity=${params.entity}, view=${params.view}`,
		);

		return this.repository.findEffective(params);
	}

	/**
	 * 사용자 개인 설정 저장
	 *
	 * 개인 컬럼 순서, 너비 조정 등 사용자별 UI 커스터마이징을 저장합니다.
	 * scope는 USER로 고정됩니다.
	 *
	 * @param spaceId - Space ID
	 * @param entity - 엔티티명 (User, Reservation 등)
	 * @param view - 뷰 타입 (table, form, detail)
	 * @param userId - 사용자 ID
	 * @param config - 설정 데이터 (JSON)
	 * @returns 저장된 UI 설정
	 */
	async saveUserConfig(
		spaceId: string,
		entity: string,
		view: string,
		userId: string,
		config: Prisma.InputJsonValue,
	): Promise<UIConfig> {
		this.logger.debug(
			`사용자 설정 저장: entity=${entity}, view=${view}, userId=${userId.slice(-8)}`,
		);

		const result = await this.repository.upsert({
			spaceId,
			entity,
			view,
			scope: UIConfigScope.USER,
			scopeId: userId,
			config,
		});

		this.logger.log(
			`사용자 설정 저장 완료: id=${result.id.slice(-8)}, entity=${entity}, view=${view}`,
		);

		return result;
	}

	/**
	 * 역할별 설정 저장 (관리자용)
	 *
	 * 특정 역할에 대한 기본 UI 설정을 저장합니다.
	 * 해당 역할을 가진 모든 사용자에게 적용됩니다 (개인 설정이 없는 경우).
	 * scope는 ROLE로 고정됩니다.
	 *
	 * @param spaceId - Space ID
	 * @param entity - 엔티티명 (User, Reservation 등)
	 * @param view - 뷰 타입 (table, form, detail)
	 * @param roleId - 역할 ID
	 * @param config - 설정 데이터 (JSON)
	 * @returns 저장된 UI 설정
	 */
	async saveRoleConfig(
		spaceId: string,
		entity: string,
		view: string,
		roleId: string,
		config: Prisma.InputJsonValue,
	): Promise<UIConfig> {
		this.logger.debug(
			`역할별 설정 저장: entity=${entity}, view=${view}, roleId=${roleId.slice(-8)}`,
		);

		const result = await this.repository.upsert({
			spaceId,
			entity,
			view,
			scope: UIConfigScope.ROLE,
			scopeId: roleId,
			config,
		});

		this.logger.log(
			`역할별 설정 저장 완료: id=${result.id.slice(-8)}, entity=${entity}, view=${view}`,
		);

		return result;
	}

	/**
	 * Space 기본 설정 저장 (관리자용)
	 *
	 * Space 전체의 기본 UI 설정을 저장합니다.
	 * 역할별, 개인별 설정이 없는 경우 이 설정이 적용됩니다.
	 * scope는 GLOBAL로 고정됩니다.
	 *
	 * @param spaceId - Space ID
	 * @param entity - 엔티티명 (User, Reservation 등)
	 * @param view - 뷰 타입 (table, form, detail)
	 * @param config - 설정 데이터 (JSON)
	 * @returns 저장된 UI 설정
	 */
	async saveGlobalConfig(
		spaceId: string,
		entity: string,
		view: string,
		config: Prisma.InputJsonValue,
	): Promise<UIConfig> {
		this.logger.debug(
			`Global 설정 저장: entity=${entity}, view=${view}, spaceId=${spaceId.slice(-8)}`,
		);

		const result = await this.repository.upsert({
			spaceId,
			entity,
			view,
			scope: UIConfigScope.GLOBAL,
			scopeId: null,
			config,
		});

		this.logger.log(
			`Global 설정 저장 완료: id=${result.id.slice(-8)}, entity=${entity}, view=${view}`,
		);

		return result;
	}

	/**
	 * 설정 삭제 (기본값으로 복원)
	 *
	 * UI 설정을 삭제하면 코드 기본값이 적용됩니다.
	 * 물리 삭제를 수행합니다.
	 *
	 * @param id - UIConfig ID
	 * @returns 삭제된 UI 설정
	 * @throws NotFoundException - 설정을 찾을 수 없는 경우
	 */
	async deleteConfig(id: string): Promise<UIConfig> {
		this.logger.debug(`설정 삭제: id=${id.slice(-8)}`);

		// 존재 여부 확인
		const existing = await this.repository.findById(id);
		if (!existing) {
			throw new NotFoundException(
				UIConfigServiceErrorMessages.CONFIG_NOT_FOUND,
			);
		}

		const result = await this.repository.deleteById(id);

		this.logger.log(
			`설정 삭제 완료: id=${id.slice(-8)}, entity=${result.entity}, view=${result.view}`,
		);

		return result;
	}
}
