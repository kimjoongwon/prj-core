/**
 * CASL Ability Factory
 *
 * @description
 * 사용자의 Role에 따라 CASL Ability 객체를 생성합니다.
 * DB에 저장된 권한 정보를 기반으로 런타임에 권한을 구성합니다.
 */

import { Ability, AbilityBuilder } from "@casl/ability";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { Ability as DomainAbility, RoleAssignment } from "@cocrepo/entity";
import { RoleAssignmentsRepository } from "@cocrepo/repository";
import type {
	ContextTenantSnapshot,
	ContextUserSnapshot,
	DatabaseId,
} from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import {
	resolveCurrentTenantById,
	resolveTenantSpaceId,
} from "../util/permission.util";
import type { Actions, AppAbility, AppAbilityClass, Subjects } from "./types";

/**
 * RoleAssignment에서 추출한 Ability 데이터와 priority를 결합한 타입
 *
 * @description
 * Prisma에서 조회한 Ability 데이터를 spread하고 RoleAssignment.priority를 추가하면
 * AbilityEntity 클래스의 메서드(isAllowed, isDenied 등)를 잃게 됩니다.
 * mergeAbilities/applyAbilityRule에서는 메서드가 필요 없으므로
 * Prisma의 데이터 타입에 관계 필드와 required priority를 추가한
 * 구조적 타입을 사용합니다.
 */
type AbilityWithPriority = Pick<
	DomainAbility,
	"id" | "conditions" | "inverted" | "subject" | "action"
> & {
	priority: number;
	assignmentCreatedAt?: Date;
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

/** 템플릿 변수 하나만으로 구성된 조건 문자열을 판별합니다. */
const EXACT_TEMPLATE_VARIABLE_PATTERN = /^\$\{([^}]+)\}$/;

@Injectable()
export class CaslAbilityFactory {
	private readonly logger = new Logger(CaslAbilityFactory.name);

	constructor(
		private readonly roleAssignmentsRepository: RoleAssignmentsRepository,
		private readonly cls: ClsService,
	) {}

	/**
	 * 사용자를 위한 CASL Ability 객체를 생성합니다.
	 *
	 * @param user - 현재 사용자 정보 (ContextUserSnapshot)
	 * @returns 사용자의 권한이 적용된 AppAbility 객체
	 *
	 * @description
	 * 1. x-tenant-id 헤더에서 현재 tenant를 가져와 spaceId 파생
	 * 2. RoleAssignment로 Role 기반 정책 조회 (RoleAssignment → Policy → Ability)
	 * 3. 권한 병합 (priority 기반)
	 * 4. AbilityBuilder로 권한 생성
	 * 5. conditions 파싱 (템플릿 변수 치환)
	 * 6. CAN/CAN_NOT에 따라 can/cannot 호출
	 */
	async createForUser(user: ContextUserSnapshot): Promise<AppAbility> {
		const abilityBuilder = new AbilityBuilder<AppAbility>(
			Ability as AppAbilityClass,
		);

		// x-tenant-id 헤더에서 현재 tenant를 가져와서 spaceId 파생
		const tenantId = this.cls.get<DatabaseId>(CONTEXT_KEYS.TENANT_ID);
		const currentTenant =
			this.cls.get<ContextTenantSnapshot | undefined>(CONTEXT_KEYS.TENANT) ??
			resolveCurrentTenantById(user.tenants, tenantId);
		const spaceId = currentTenant
			? resolveTenantSpaceId(currentTenant)
			: this.cls.get<DatabaseId | undefined>(CONTEXT_KEYS.SPACE_ID);

		if (!tenantId || !spaceId || !currentTenant?.role) {
			this.logger.warn(
				`사용자에게 현재 Tenant 또는 Role이 없습니다: userId=${user.id}, tenantId=${tenantId}, spaceId=${spaceId}`,
			);
			return abilityBuilder.build();
		}

		const roleId = currentTenant.roleId;
		this.logger.debug(
			`사용자 권한 생성 시작: userId=${user.id}, roleId=${roleId}, spaceId=${spaceId}`,
		);

		const roleAssignments =
			await this.roleAssignmentsRepository.findActiveByRoleIdsInSpace(
				[roleId],
				spaceId,
			);
		const roleAbilities = this.expandRoleAssignmentAbilities(roleAssignments);
		this.logger.debug(
			`Role 기반 Ability 조회: ${roleAbilities.length}개, roleId=${roleId}`,
		);

		const mergedAbilities = this.mergeAbilities(roleAbilities);
		this.logger.debug(`병합된 Ability 개수: ${mergedAbilities.length}`);

		// 사용자 컨텍스트 구성 (템플릿 변수 치환용)
		const userContext = this.buildUserContext(user, currentTenant);

		// 각 Ability를 CASL 규칙으로 변환
		for (const ability of mergedAbilities) {
			this.applyAbilityRule(
				ability,
				userContext,
				abilityBuilder.can.bind(abilityBuilder),
				abilityBuilder.cannot.bind(abilityBuilder),
			);
		}

		return abilityBuilder.build();
	}

	/**
	 * Role 권한을 병합합니다.
	 *
	 * @param roleAbilities - Role 기반 권한 목록
	 * @returns 병합된 권한 목록 (priority 기준 정렬)
	 *
	 * @description
	 * 동일한 subject + action 조합이 있을 경우 priority가 높은 것이 우선합니다.
	 * 병합 후 priority 내림차순으로 정렬하여 반환합니다.
	 */
	private mergeAbilities(
		roleAbilities: AbilityWithPriority[],
	): AbilityWithPriority[] {
		// subject + action 조합을 키로 사용하여 Map 구성
		const abilityMap = new Map<string, AbilityWithPriority>();

		for (const ability of roleAbilities) {
			const key = this.getAbilityKey(ability);
			if (!key) continue;

			const existingAbility = abilityMap.get(key);

			if (
				!existingAbility ||
				this.compareAbilityPriority(ability, existingAbility) > 0
			) {
				abilityMap.set(key, ability);
			}
		}

		const mergedAbilities = Array.from(abilityMap.values()).sort((a, b) =>
			this.compareAbilityPriority(b, a),
		);

		return mergedAbilities;
	}

	private expandRoleAssignmentAbilities(
		roleAssignments: RoleAssignment[],
	): AbilityWithPriority[] {
		return roleAssignments.flatMap((roleAssignment) =>
			this.expandPolicyEntries(roleAssignment),
		);
	}

	private expandPolicyEntries(
		assignment: RoleAssignment,
	): AbilityWithPriority[] {
		const policyEntries = assignment.policy?.entries ?? [];

		return policyEntries
			.filter((policyEntry) => policyEntry.ability)
			.map((policyEntry) => ({
				...policyEntry.ability!,
				priority: assignment.priority,
				assignmentCreatedAt: assignment.createdAt,
			}));
	}

	private compareAbilityPriority(
		a: AbilityWithPriority,
		b: AbilityWithPriority,
	): number {
		if (a.priority !== b.priority) {
			return a.priority - b.priority;
		}

		const aCreatedAt = a.assignmentCreatedAt?.getTime() ?? 0;
		const bCreatedAt = b.assignmentCreatedAt?.getTime() ?? 0;
		return aCreatedAt - bCreatedAt;
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
		user: ContextUserSnapshot,
		currentTenant: NonNullable<ContextUserSnapshot["tenants"]>[number],
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
	 * @param ability - Policy에서 추출한 Ability 데이터 (priority 포함)
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
			return this.replaceConditionValue(conditions, userContext) as Record<
				string,
				unknown
			>;
		} catch (error) {
			this.logger.error(
				`조건 파싱 중 오류 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
			);
			return undefined;
		}
	}

	/**
	 * 조건 트리를 순회하며 템플릿 값을 원래 런타임 타입으로 치환합니다.
	 *
	 * @param value 현재 조건 값
	 * @param context 템플릿 변수 컨텍스트
	 * @returns bigint를 포함한 런타임 조건 값
	 */
	private replaceConditionValue(
		value: unknown,
		context: Record<string, unknown>,
	): unknown {
		if (Array.isArray(value)) {
			return value.map((item) => this.replaceConditionValue(item, context));
		}

		if (value && typeof value === "object") {
			return Object.fromEntries(
				Object.entries(value).map(([key, childValue]) => [
					key,
					this.replaceConditionValue(childValue, context),
				]),
			);
		}

		if (typeof value !== "string") {
			return value;
		}

		const exactMatch = EXACT_TEMPLATE_VARIABLE_PATTERN.exec(value);
		if (exactMatch) {
			return this.resolveTemplateVariable(exactMatch[1], context);
		}

		return this.replaceTemplateVariables(value, context);
	}

	/**
	 * 허용된 템플릿 변수 값을 컨텍스트에서 조회합니다.
	 *
	 * @param path 조회할 변수 경로
	 * @param context 템플릿 변수 컨텍스트
	 * @returns 조회한 값, 미허용 또는 누락 값이면 빈 문자열
	 */
	private resolveTemplateVariable(
		path: string,
		context: Record<string, unknown>,
	): unknown {
		if (
			!ALLOWED_TEMPLATE_VARIABLES.includes(
				path as (typeof ALLOWED_TEMPLATE_VARIABLES)[number],
			)
		) {
			this.logger.warn(`허용되지 않은 템플릿 변수: ${path}`);
			return "";
		}

		const value = this.getValueByPath(context, path);
		if (value === undefined || value === null) {
			this.logger.warn(`템플릿 변수 값이 없습니다: ${path}`);
			return "";
		}

		return value;
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
				const value = this.resolveTemplateVariable(path, context);
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
