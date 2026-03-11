/**
 * CASL Ability Factory
 *
 * @description
 * 사용자의 Role에 따라 CASL Ability 객체를 생성합니다.
 * DB에 저장된 권한 정보를 기반으로 런타임에 권한을 구성합니다.
 */

import { Ability, AbilityBuilder } from "@casl/ability";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { UserDto } from "@cocrepo/dto";
import type {
	Ability as PrismaAbility,
	Action as PrismaAction,
	Subject as PrismaSubject,
} from "@cocrepo/prisma";
import { GrantsRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import type { Actions, AppAbility, AppAbilityClass, Subjects } from "./types";

/**
 * Grant에서 추출한 Ability 데이터와 priority를 결합한 타입
 *
 * @description
 * Prisma에서 조회한 Ability 데이터를 spread하고 Grant.priority를 추가하면
 * AbilityEntity 클래스의 메서드(isAllowed, isDenied 등)를 잃게 됩니다.
 * mergeAbilities/applyAbilityRule에서는 메서드가 필요 없으므로
 * Prisma의 데이터 타입에 관계 필드와 required priority를 추가한
 * 구조적 타입을 사용합니다.
 */
type AbilityWithPriority = PrismaAbility & {
	priority: number;
	subject?: PrismaSubject;
	action?: PrismaAction;
};

/**
 * 템플릿 변수 파싱에 사용되는 허용된 변수 목록
 *
 * @description
 * 보안을 위해 허용된 변수만 치환합니다.
 */
const ALLOWED_TEMPLATE_VARIABLES = [
	"user.id",
	"user.spaceId",
	"user.email",
	"user.name",
	"user.currentTenantId",
	"user.currentSpaceId",
	"user.currentRoleId",
	"user.roleCategory",
	"user.roleGroupNames",
	"user.userCategory",
	"user.userGroupNames",
] as const;

/**
 * 템플릿 변수 정규식 패턴
 *
 * @description
 * ${user.id}, ${user.currentSpaceId} 등의 패턴을 매칭합니다.
 */
const TEMPLATE_VARIABLE_PATTERN = /\$\{([^}]+)\}/g;

@Injectable()
export class CaslAbilityFactory {
	private readonly logger = new Logger(CaslAbilityFactory.name);

	constructor(
		private readonly grantsRepository: GrantsRepository,
		private readonly cls: ClsService,
	) {}

	/**
	 * 사용자를 위한 CASL Ability 객체를 생성합니다.
	 *
	 * @param user - 현재 사용자 정보 (UserDto)
	 * @returns 사용자의 권한이 적용된 AppAbility 객체
	 *
	 * @description
	 * 1. x-space-id 헤더에서 spaceId를 가져와서 해당 tenant 찾기
	 * 2. GrantsRepository로 Role 기반 권한 조회 (Grant → Ability)
	 * 3. GrantsRepository로 User 예외 권한 조회 (Grant → Ability)
	 * 4. 권한 병합 (User 권한이 Role 권한보다 우선 - Grant.priority 기반)
	 * 5. AbilityBuilder로 권한 생성
	 * 6. conditions 파싱 (템플릿 변수 치환)
	 * 7. CAN/CAN_NOT에 따라 can/cannot 호출
	 */
	async createForUser(user: UserDto): Promise<AppAbility> {
		const { can, cannot, build } = new AbilityBuilder<AppAbility>(
			Ability as AppAbilityClass,
		);

		// x-space-id 헤더에서 spaceId를 가져와서 해당 tenant 찾기
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		const currentTenant = spaceId
			? user.tenants?.find((tenant) => tenant.spaceId === spaceId)
			: user.tenants?.[0]; // spaceId가 없으면 첫 번째 tenant 사용

		if (!currentTenant?.role) {
			this.logger.warn(
				`사용자에게 현재 Space의 Tenant 또는 Role이 없습니다: userId=${user.id}, spaceId=${spaceId}`,
			);
			return build();
		}

		const roleId = currentTenant.roleId;
		this.logger.debug(
			`사용자 권한 생성 시작: userId=${user.id}, roleId=${roleId}, spaceId=${spaceId}`,
		);

		// 1. DB에서 Role에 해당하는 활성화된 Grants 조회 (Ability 포함)
		const roleGrants = await this.grantsRepository.findActiveByRoleIds([
			roleId,
		]);
		// Grant에서 Ability 추출 (Grant.priority를 Ability.priority로 복사)
		const roleAbilities: AbilityWithPriority[] = roleGrants
			.filter((grant) => grant.ability)
			.map((grant) => ({
				...grant.ability!,
				priority: grant.priority, // Grant의 priority 사용
			}));
		this.logger.debug(
			`Role 기반 Ability 조회: ${roleAbilities.length}개, roleId=${roleId}`,
		);

		// 2. DB에서 User에 해당하는 활성화된 예외 Grants 조회 (Ability 포함)
		const userGrants = await this.grantsRepository.findActiveByUserId(user.id);
		// Grant에서 Ability 추출 (Grant.priority를 Ability.priority로 복사)
		const userAbilities: AbilityWithPriority[] = userGrants
			.filter((grant) => grant.ability)
			.map((grant) => ({
				...grant.ability!,
				priority: grant.priority, // Grant의 priority 사용
			}));
		this.logger.debug(
			`User 예외 Ability 조회: ${userAbilities.length}개, userId=${user.id}`,
		);

		// 3. 권한 병합 (User 권한이 Role 권한보다 우선)
		const mergedAbilities = this.mergeAbilities(roleAbilities, userAbilities);
		this.logger.debug(`병합된 Ability 개수: ${mergedAbilities.length}`);

		// 사용자 컨텍스트 구성 (템플릿 변수 치환용)
		const userContext = this.buildUserContext(user, currentTenant);

		// 각 Ability를 CASL 규칙으로 변환
		for (const ability of mergedAbilities) {
			this.applyAbilityRule(ability, userContext, can, cannot);
		}

		return build();
	}

	/**
	 * Role 권한과 User 예외 권한을 병합합니다.
	 *
	 * @param roleAbilities - Role 기반 권한 목록
	 * @param userAbilities - User 예외 권한 목록
	 * @returns 병합된 권한 목록 (priority 기준 정렬)
	 *
	 * @description
	 * 동일한 subject + action 조합이 있을 경우 priority가 높은 것이 우선합니다.
	 * User 예외 권한은 일반적으로 priority가 높게 설정됩니다 (10 이상).
	 * 병합 후 priority 내림차순으로 정렬하여 반환합니다.
	 */
	private mergeAbilities(
		roleAbilities: AbilityWithPriority[],
		userAbilities: AbilityWithPriority[],
	): AbilityWithPriority[] {
		// subject + action 조합을 키로 사용하여 Map 구성
		const abilityMap = new Map<string, AbilityWithPriority>();

		// 1. Role 권한을 먼저 추가
		for (const ability of roleAbilities) {
			const key = this.getAbilityKey(ability);
			if (key) {
				abilityMap.set(key, ability);
			}
		}

		// 2. User 예외 권한으로 덮어쓰기 (priority가 높은 것이 우선)
		for (const ability of userAbilities) {
			const key = this.getAbilityKey(ability);
			if (!key) continue;

			const existingAbility = abilityMap.get(key);

			// 기존 권한이 없거나, User 권한의 priority가 더 높으면 덮어쓰기
			if (!existingAbility || ability.priority > existingAbility.priority) {
				abilityMap.set(key, ability);
				this.logger.debug(
					`User 예외 권한 적용: subject=${ability.subject?.name}, action=${ability.action?.name}, priority=${ability.priority}`,
				);
			}
		}

		// 3. priority 내림차순으로 정렬
		const mergedAbilities = Array.from(abilityMap.values()).sort(
			(a, b) => b.priority - a.priority,
		);

		return mergedAbilities;
	}

	/**
	 * Ability의 고유 키를 생성합니다.
	 *
	 * @param ability - Ability 데이터 (priority 포함)
	 * @returns subject + action 조합 키 또는 null
	 */
	private getAbilityKey(ability: AbilityWithPriority): string | null {
		if (!ability.subject?.name || !ability.action?.name) {
			return null;
		}
		return `${ability.subject.name}:${ability.action.name}`;
	}

	/**
	 * 사용자 컨텍스트를 구성합니다.
	 *
	 * @param user - 사용자 정보
	 * @param currentTenant - 현재 Space의 테넌트 정보
	 * @returns 템플릿 변수 치환에 사용할 컨텍스트 객체
	 */
	private buildUserContext(
		user: UserDto,
		currentTenant: NonNullable<UserDto["tenants"]>[number],
	): Record<string, unknown> {
		// 역할 카테고리
		const roleCategory =
			currentTenant.role?.classification?.category?.name ?? "";

		// 역할 그룹 이름 배열
		const roleGroupNames =
			currentTenant.role?.associations
				?.map((association) => association.group?.name)
				.filter((name): name is string => name !== undefined) ?? [];

		// 이용자 카테고리
		const userCategory = user.classification?.category?.name ?? "";

		// 이용자 그룹 이름 배열
		const userGroupNames =
			user.associations
				?.map((association) => association.group?.name)
				.filter((name): name is string => name !== undefined) ?? [];

		return {
			user: {
				id: user.id,
				spaceId: user.spaceId,
				email: user.email,
				name: user.name,
				currentTenantId: currentTenant.id,
				currentSpaceId: currentTenant.spaceId,
				currentRoleId: currentTenant.roleId,
				roleCategory,
				roleGroupNames,
				userCategory,
				userGroupNames,
			},
		};
	}

	/**
	 * 단일 Ability 규칙을 적용합니다.
	 *
	 * @param ability - Grant에서 추출한 Ability 데이터 (priority 포함)
	 * @param userContext - 사용자 컨텍스트
	 * @param can - CASL can 함수
	 * @param cannot - CASL cannot 함수
	 */
	private applyAbilityRule(
		ability: AbilityWithPriority,
		userContext: Record<string, unknown>,
		can: (
			action: Actions,
			subject: Subjects,
			conditions?: Record<string, unknown>,
		) => void,
		cannot: (
			action: Actions,
			subject: Subjects,
			conditions?: Record<string, unknown>,
		) => void,
	): void {
		if (!ability.subject) {
			this.logger.warn(`Ability에 Subject가 없습니다: abilityId=${ability.id}`);
			return;
		}

		if (!ability.action) {
			this.logger.warn(`Ability에 Action이 없습니다: abilityId=${ability.id}`);
			return;
		}

		// Action 이름을 대문자로 변환하여 사용
		const action = ability.action.name.toUpperCase() as Actions;
		const subject = ability.subject.name as Subjects;

		// conditions 파싱 (템플릿 변수 치환)
		const conditions = this.parseConditions(ability.conditions, userContext);

		// inverted가 false이면 CAN (허용), true이면 CANNOT (거부)
		if (!ability.inverted) {
			can(action, subject, conditions);
			this.logger.verbose(
				`CAN 권한 추가: action=${action}, subject=${subject}`,
			);
		} else {
			cannot(action, subject, conditions);
			this.logger.verbose(
				`CANNOT 권한 추가: action=${action}, subject=${subject}`,
			);
		}
	}

	/**
	 * 조건을 파싱하고 템플릿 변수를 치환합니다.
	 *
	 * @param conditions - DB에 저장된 조건 (JSON)
	 * @param userContext - 사용자 컨텍스트
	 * @returns 파싱된 조건 객체 또는 undefined
	 *
	 * @description
	 * 보안을 위해 허용된 템플릿 변수만 치환합니다.
	 * 예: ${user.id} → 실제 사용자 ID
	 *     ${user.currentSpaceId} → 현재 Space ID
	 */
	parseConditions(
		conditions: unknown,
		userContext: Record<string, unknown>,
	): Record<string, unknown> | undefined {
		if (!conditions || typeof conditions !== "object") {
			return undefined;
		}

		try {
			// 조건을 문자열로 변환 후 템플릿 변수 치환
			const conditionsString = JSON.stringify(conditions);
			const parsedString = this.replaceTemplateVariables(
				conditionsString,
				userContext,
			);
			return JSON.parse(parsedString);
		} catch (error) {
			this.logger.error(
				`조건 파싱 중 오류 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
			);
			return undefined;
		}
	}

	/**
	 * 템플릿 변수를 실제 값으로 치환합니다.
	 *
	 * @param template - 템플릿 문자열
	 * @param context - 변수 값이 담긴 컨텍스트
	 * @returns 치환된 문자열
	 *
	 * @description
	 * 보안 검증:
	 * - 허용된 변수만 치환
	 * - 허용되지 않은 변수는 빈 문자열로 치환
	 */
	private replaceTemplateVariables(
		template: string,
		context: Record<string, unknown>,
	): string {
		return template.replace(
			TEMPLATE_VARIABLE_PATTERN,
			(_match, path: string) => {
				// 보안 검증: 허용된 변수인지 확인
				if (
					!ALLOWED_TEMPLATE_VARIABLES.includes(
						path as (typeof ALLOWED_TEMPLATE_VARIABLES)[number],
					)
				) {
					this.logger.warn(`허용되지 않은 템플릿 변수: ${path}`);
					return '""'; // 빈 문자열로 치환 (JSON 호환)
				}

				// 경로를 따라 값 추출 (예: user.id -> context.user.id)
				const value = this.getValueByPath(context, path);

				if (value === undefined || value === null) {
					this.logger.warn(`템플릿 변수 값이 없습니다: ${path}`);
					return '""';
				}

				// 문자열이면 따옴표로 감싸서 반환 (JSON 호환)
				if (typeof value === "string") {
					return `"${value}"`;
				}

				return String(value);
			},
		);
	}

	/**
	 * 점(.)으로 구분된 경로로 객체에서 값을 추출합니다.
	 *
	 * @param obj - 대상 객체
	 * @param path - 점으로 구분된 경로 (예: "user.id")
	 * @returns 추출된 값 또는 undefined
	 */
	private getValueByPath(obj: Record<string, unknown>, path: string): unknown {
		const keys = path.split(".");
		let current: unknown = obj;

		for (const key of keys) {
			if (current === null || current === undefined) {
				return undefined;
			}
			if (typeof current !== "object") {
				return undefined;
			}
			current = (current as Record<string, unknown>)[key];
		}

		return current;
	}
}
