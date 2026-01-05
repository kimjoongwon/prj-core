/**
 * CASL Ability Factory
 *
 * @description
 * 사용자의 Role에 따라 CASL Ability 객체를 생성합니다.
 * DB에 저장된 권한 정보를 기반으로 런타임에 권한을 구성합니다.
 */
import { Ability as AbilityEntity } from "@cocrepo/entity";
import { AbilityTypes } from "@cocrepo/prisma";
import { AbilitiesRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";
import { Ability, AbilityBuilder } from "@casl/ability";
import type { UserDto } from "@cocrepo/dto";
import type { Actions, AppAbility, AppAbilityClass, Subjects } from "./types";

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
	"user.mainTenantId",
	"user.mainSpaceId",
	"user.mainRoleId",
] as const;

/**
 * 템플릿 변수 정규식 패턴
 *
 * @description
 * ${user.id}, ${user.mainSpaceId} 등의 패턴을 매칭합니다.
 */
const TEMPLATE_VARIABLE_PATTERN = /\$\{([^}]+)\}/g;

@Injectable()
export class CaslAbilityFactory {
	private readonly logger = new Logger(CaslAbilityFactory.name);

	constructor(private readonly abilitiesRepository: AbilitiesRepository) {}

	/**
	 * 사용자를 위한 CASL Ability 객체를 생성합니다.
	 *
	 * @param user - 현재 사용자 정보 (UserDto)
	 * @returns 사용자의 권한이 적용된 AppAbility 객체
	 *
	 * @description
	 * 1. mainTenant에서 Role 정보를 추출
	 * 2. AbilitiesRepository로 권한 조회
	 * 3. AbilityBuilder로 권한 생성
	 * 4. conditions 파싱 (템플릿 변수 치환)
	 * 5. CAN/CAN_NOT에 따라 can/cannot 호출
	 */
	async createForUser(user: UserDto): Promise<AppAbility> {
		const { can, cannot, build } = new AbilityBuilder<AppAbility>(
			Ability as AppAbilityClass,
		);

		// mainTenant에서 Role 정보 추출
		const mainTenant = user.tenants?.find((tenant) => tenant.main);

		if (!mainTenant?.role) {
			this.logger.warn(
				`사용자에게 mainTenant 또는 Role이 없습니다: userId=${user.id}`,
			);
			return build();
		}

		const roleId = mainTenant.roleId;
		this.logger.debug(
			`사용자 권한 생성 시작: userId=${user.id}, roleId=${roleId}`,
		);

		// DB에서 Role에 해당하는 활성화된 Abilities 조회
		const abilities =
			await this.abilitiesRepository.findManyActiveByRoleIdsWithRoleAndSubject([
				roleId,
			]);

		this.logger.debug(
			`조회된 Ability 개수: ${abilities.length}, roleId=${roleId}`,
		);

		// 사용자 컨텍스트 구성 (템플릿 변수 치환용)
		const userContext = this.buildUserContext(user, mainTenant);

		// 각 Ability를 CASL 규칙으로 변환
		for (const ability of abilities) {
			this.applyAbilityRule(ability, userContext, can, cannot);
		}

		return build();
	}

	/**
	 * 사용자 컨텍스트를 구성합니다.
	 *
	 * @param user - 사용자 정보
	 * @param mainTenant - 메인 테넌트 정보
	 * @returns 템플릿 변수 치환에 사용할 컨텍스트 객체
	 */
	private buildUserContext(
		user: UserDto,
		mainTenant: NonNullable<UserDto["tenants"]>[number],
	): Record<string, unknown> {
		return {
			user: {
				id: user.id,
				spaceId: user.spaceId,
				email: user.email,
				name: user.name,
				mainTenantId: mainTenant.id,
				mainSpaceId: mainTenant.spaceId,
				mainRoleId: mainTenant.roleId,
			},
		};
	}

	/**
	 * 단일 Ability 규칙을 적용합니다.
	 *
	 * @param ability - DB에서 조회한 Ability 엔티티
	 * @param userContext - 사용자 컨텍스트
	 * @param can - CASL can 함수
	 * @param cannot - CASL cannot 함수
	 */
	private applyAbilityRule(
		ability: AbilityEntity,
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
			this.logger.warn(
				`Ability에 Subject가 없습니다: abilityId=${ability.id}`,
			);
			return;
		}

		const action = ability.action as Actions;
		const subject = ability.subject.name;

		// conditions 파싱 (템플릿 변수 치환)
		const conditions = this.parseConditions(ability.conditions, userContext);

		if (ability.type === AbilityTypes.CAN) {
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
	 *     ${user.mainSpaceId} → 실제 메인 스페이스 ID
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
		return template.replace(TEMPLATE_VARIABLE_PATTERN, (match, path: string) => {
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
		});
	}

	/**
	 * 점(.)으로 구분된 경로로 객체에서 값을 추출합니다.
	 *
	 * @param obj - 대상 객체
	 * @param path - 점으로 구분된 경로 (예: "user.id")
	 * @returns 추출된 값 또는 undefined
	 */
	private getValueByPath(
		obj: Record<string, unknown>,
		path: string,
	): unknown {
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
