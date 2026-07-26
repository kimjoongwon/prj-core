/**
 * CASL 정책 핸들러
 *
 * @description
 * 권한 검사에 사용되는 정책 핸들러들을 정의합니다.
 * 각 핸들러는 특정 권한 검사 로직을 캡슐화합니다.
 */
import type { Actions, AppAbility } from "./types";

/**
 * 정책 핸들러 인터페이스
 *
 * @description
 * 권한 검사를 수행하는 핸들러의 기본 인터페이스입니다.
 */
export interface IPolicyHandler {
	/**
	 * 권한 검사를 수행합니다.
	 * @param ability - CASL Ability 객체
	 * @returns 권한이 있으면 true, 없으면 false
	 */
	handle(ability: AppAbility): boolean;
}

/**
 * 정책 핸들러 콜백 타입
 *
 * @description
 * 함수 형태의 정책 핸들러를 정의합니다.
 */
export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

/**
 * 정책 핸들러 타입
 *
 * @description
 * 클래스 기반 핸들러 또는 콜백 함수 모두 사용할 수 있습니다.
 */
export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

/**
 * 메뉴 접근 권한 정책
 *
 * @description
 * 특정 메뉴에 대한 ACCESS 권한을 확인합니다.
 *
 * @example
 * // Controller에서 사용
 * @CheckPolicies(new AccessMenuPolicy('menu:members'))
 * async getMembers() { ... }
 */
export class AccessMenuPolicy implements IPolicyHandler {
	/**
	 * @param subject - 메뉴 Subject (예: 'menu:members', 'menu:settings')
	 */
	constructor(private readonly subject: string) {}

	/**
	 * ACCESS 권한을 확인합니다.
	 */
	handle(ability: AppAbility): boolean {
		return ability.can("ACCESS", this.subject);
	}
}

/**
 * 엔티티 관리 권한 정책
 *
 * @description
 * 특정 엔티티에 대한 CRUD 권한을 확인합니다.
 *
 * @example
 * // Controller에서 사용
 * @CheckPolicies(new ManageEntityPolicy('READ', 'entity:User'))
 * async getUsers() { ... }
 *
 * @CheckPolicies(new ManageEntityPolicy('CREATE', 'entity:Reservation'))
 * async createReservation() { ... }
 */
export class ManageEntityPolicy implements IPolicyHandler {
	/**
	 * @param action - 수행할 행위 (CREATE, READ, UPDATE, DELETE, MANAGE 등)
	 * @param subject - 엔티티 Subject (예: 'entity:User', 'entity:FitnessCenter', 'entity:Reservation')
	 */
	constructor(
		private readonly action: Actions,
		private readonly subject: string,
	) {}

	/**
	 * 지정된 Action에 대한 권한을 확인합니다.
	 */
	handle(ability: AppAbility): boolean {
		return ability.can(this.action, this.subject);
	}
}

/**
 * 기능 접근 권한 정책
 *
 * @description
 * 특정 기능에 대한 권한을 확인합니다.
 *
 * @example
 * // Controller에서 사용
 * @CheckPolicies(new AccessFeaturePolicy('feature:export'))
 * async exportData() { ... }
 */
export class AccessFeaturePolicy implements IPolicyHandler {
	/**
	 * @param subject - 기능 Subject (예: 'feature:export', 'feature:bulk-delete')
	 */
	constructor(private readonly subject: string) {}

	/**
	 * ACCESS 권한을 확인합니다.
	 */
	handle(ability: AppAbility): boolean {
		return ability.can("ACCESS", this.subject);
	}
}

/**
 * API 접근 권한 정책
 *
 * @description
 * 특정 API 엔드포인트에 대한 권한을 확인합니다.
 *
 * @example
 * // Controller에서 사용
 * @CheckPolicies(new AccessApiPolicy('api:users'))
 * async getUsersApi() { ... }
 */
export class AccessApiPolicy implements IPolicyHandler {
	/**
	 * @param subject - API Subject (예: 'api:users', 'api:reports')
	 */
	constructor(private readonly subject: string) {}

	/**
	 * ACCESS 권한을 확인합니다.
	 */
	handle(ability: AppAbility): boolean {
		return ability.can("ACCESS", this.subject);
	}
}

/**
 * 커스텀 권한 정책
 *
 * @description
 * 임의의 Action과 Subject 조합에 대한 권한을 확인합니다.
 *
 * @example
 * // Controller에서 사용
 * @CheckPolicies(new CustomPolicy('APPROVE', 'entity:Reservation'))
 * async approveReservation() { ... }
 */
export class CustomPolicy implements IPolicyHandler {
	/**
	 * @param action - 수행할 행위
	 * @param subject - 권한 대상
	 */
	constructor(
		private readonly action: Actions,
		private readonly subject: string,
	) {}

	/**
	 * 지정된 Action과 Subject에 대한 권한을 확인합니다.
	 */
	handle(ability: AppAbility): boolean {
		return ability.can(this.action, this.subject);
	}
}
